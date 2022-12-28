import { GetStaticProps } from "next";
import Head from "next/head";
import styles from "../styles/styles.module.scss";

import firebase from "../services/firebaseConnection";
import { useState } from "react";

type DonorData = {
  id: string;
  donate: boolean;
  lastDonate: Date;
  image: string;
};

interface HomeProps {
  donorsData: string;
}

export default function Home({ donorsData }: HomeProps) {
  const [donors, setDonors] = useState<DonorData[]>(JSON.parse(donorsData));

  return (
    <>
      <Head>
        <title>Board - Organizando suas tarefas. </title>
      </Head>
      <main className={styles.contentContainer}>
        <img src="/images/board-user.svg" alt="Ferramenta board" />

        <section className={styles.callToAction}>
          <h1>
            Uma ferramenta para seu dia a dia. Escreva, planeje e organize-se.
          </h1>
          <p>
            <span>100% Gratuita</span> e online.
          </p>
        </section>

        {donors.length !== 0 && <h3>Apoiadores</h3>}
        <div className={styles.donors}>
          {donors.map((donor) => (
            <img key={donor.id} src={donor.image} alt="Imagem do doador" />
          ))}
        </div>
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const donors = await firebase.firestore().collection("users").get();

  const donorsData = JSON.stringify(
    donors.docs.map((donor) => {
      return {
        id: donor.id,
        ...donor.data(),
      };
    })
  );

  return {
    props: {
      donorsData,
    },
    revalidate: 60 * 60, // Atualiza a cada 60 minutos
  };
};
