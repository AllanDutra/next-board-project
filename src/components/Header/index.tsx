import Link from "next/link";
import { SignInButton } from "../SignInButton";
import styles from "./styles.module.scss";

import Image from "next/image";
import logo from "../../../public/images/logo.svg";

export function Header() {
  return (
    <header className={styles.headerContainer}>
      <div className={styles.headerContent}>
        <Link href="/">
          <Image src={logo} alt="Logo Meu board" />
        </Link>
        <nav>
          <Link href="/">Home</Link>
          <Link href="/board">Meu board</Link>
        </nav>

        <SignInButton />
      </div>
    </header>
  );
}
