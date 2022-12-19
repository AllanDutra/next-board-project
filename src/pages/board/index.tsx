import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Link from "next/link";

import {
  FiCalendar,
  FiClock,
  FiEdit2,
  FiPlus,
  FiTrash,
  FiX,
} from "react-icons/fi";
import { SupportButton } from "../../components/SupportButton";
import styles from "./styles.module.scss";
import { FormEvent, useState } from "react";

import firebase from "../../services/firebaseConnection";
import { format } from "date-fns";

type Task = {
  id: string;
  created: string | Date;
  createdFormatted?: string;
  tarefa: string;
  userId: string;
  nome: string;
};

interface BoardProps {
  user: {
    id: string;
    nome: string;
  };
  tasksData: string;
}

export default function Board({ user, tasksData }: BoardProps) {
  const [input, setInput] = useState("");
  const [taskList, setTaskList] = useState<Task[]>(JSON.parse(tasksData));

  const [taskEdit, setTaskEdit] = useState<Task | null>(null);

  async function handleAddTask(e: FormEvent) {
    e.preventDefault();

    if (input === "") return alert("Preencha alguma tarefa!");

    if (taskEdit) {
      await firebase
        .firestore()
        .collection("tarefas")
        .doc(taskEdit.id)
        .update({
          tarefa: input,
        })
        .then(() => {
          const updatedTaskList = taskList;
          const taskEditedIndex = taskList.findIndex(
            (taskItem) => taskItem.id === taskEdit.id
          );
          updatedTaskList[taskEditedIndex].tarefa = input;

          setTaskList(updatedTaskList);
          setTaskEdit(null);
          setInput("");
        });

      return;
    }

    await firebase
      .firestore()
      .collection("tarefas")
      .add({
        created: new Date(),
        tarefa: input,
        userId: user.id,
        nome: user.nome,
      })
      .then((doc) => {
        console.log("CADASTRADO COM SUCESSO!");

        const data = {
          id: doc.id,
          created: new Date(),
          createdFormatted: format(new Date(), "dd MMMM yyyy"),
          tarefa: input,
          userId: user.id,
          nome: user.nome,
        };

        setTaskList((oldValue) => [...oldValue, data]);
        setInput("");
      })
      .catch((err) => {
        console.log("ERRO AO CADASTRAR: ", err);
      });
  }

  async function handleDeleteTask(taskId: string) {
    await firebase
      .firestore()
      .collection("tarefas")
      .doc(taskId)
      .delete()
      .then(() => {
        console.log("DELETADO COM SUCESSO!");

        setTaskList((oldValue) =>
          oldValue.filter((taskItem) => taskItem.id !== taskId)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  }

  function handleEditTask(task: Task) {
    setTaskEdit(task);
    setInput(task.tarefa);
  }

  function handleCancelEditTask() {
    setInput("");
    setTaskEdit(null);
  }

  return (
    <>
      <Head>
        <title>Minhas tarefas - Board</title>
      </Head>
      <main className={styles.container}>
        {taskEdit && (
          <span className={styles.warnText}>
            <button onClick={handleCancelEditTask}>
              <FiX size={30} color="#FF3636" />
            </button>
            Você está editando uma tarefa!
          </span>
        )}

        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Digite sua tarefa..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button type="submit">
            <FiPlus size={25} color="#17181f" />
          </button>
        </form>

        <h1>
          Você tem {taskList.length}{" "}
          {taskList.length === 1 ? "tarefa" : "tarefas"}!
        </h1>

        <section>
          {taskList.map((task) => (
            <article key={task.id} className={styles.taskList}>
              <Link href={`/board/${task.id}`}>
                <p>{task.tarefa}</p>
              </Link>
              <div className={styles.actions}>
                <div>
                  <div>
                    <FiCalendar size={20} color="#FFB800" />
                    <time>{task.createdFormatted}</time>
                  </div>
                  <button onClick={() => handleEditTask(task)}>
                    <FiEdit2 size={20} color="#FFF" />
                    <span>Editar</span>
                  </button>
                </div>

                <button onClick={() => handleDeleteTask(task.id)}>
                  <FiTrash size={20} color="#FF3636" />
                  <span>Excluir</span>
                </button>
              </div>
            </article>
          ))}
        </section>
      </main>

      <div className={styles.vipContainer}>
        <h3>Obrigado por apoiar esse projeto.</h3>
        <div>
          <FiClock size={28} color="#FFF" />
          <time>Última doação foi há 3 dias.</time>
        </div>
      </div>

      <SupportButton />
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id)
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };

  const tasks = await firebase
    .firestore()
    .collection("tarefas")
    .where("userId", "==", session?.id)
    .orderBy("created", "asc")
    .get();

  const tasksData = JSON.stringify(
    tasks.docs.map((taskItem) => {
      return {
        id: taskItem.id,
        createdFormatted: format(
          taskItem.data().created.toDate(),
          "dd MMMM yyyy"
        ),
        ...taskItem.data(),
      };
    })
  );

  const user = {
    nome: session?.user.name,
    id: session?.id,
  };

  return {
    props: {
      user,
      tasksData,
    },
  };
};
