import styles from "./styles.module.scss";
import Head from "next/head";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";

interface DonateProps {
  userData: {
    nome: string;
    id: string;
    image: string;
  };
}

export default function Donate({ userData }: DonateProps) {
  return (
    <>
      <Head>
        <title>Ajude a plataforma board a ficar online!</title>
      </Head>
      <main className={styles.container}>
        <img src="/images/rocket.svg" alt="Seja Apoiador" />

        <div className={styles.vip}>
          <img src={userData.image} alt="Foto de perfil do usuário" />
          <span>Parabéns você é um novo apoiador!</span>
        </div>

        <h1>Seja um apoiador deste projeto! 🏆</h1>
        <h3>
          Contribua com apenas <span>R$ 1,00</span>
        </h3>
        <strong>
          Apareça na nossa home, tenha funcionalidades exclusivas.
        </strong>
      </main>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const session = await getSession({ req });

  if (!session?.id) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  const userData = {
    nome: session?.user.name,
    id: session?.id,
    image: session?.user.image,
  };

  return {
    props: { userData },
  };
};
