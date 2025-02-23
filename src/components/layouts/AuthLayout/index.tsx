/* eslint-disable @typescript-eslint/no-empty-object-type */
import Link from 'next/link'
import styles from './AuthLayout.module.scss'
import { Dispatch, SetStateAction } from 'react'

type PropTypes = {
    title?: string
    children: React.ReactNode
    link: string
    linkText?: string
    setToaster: Dispatch<SetStateAction<{}>>
}

const AuthLayout = (props: PropTypes) => {
    const { title, children, link, linkText } = props
    return (
        <div className={styles.auth}>
            <h1 className={styles.auth__title}>{title}</h1>
            <div className={styles.auth__form}>{children}</div>
            <p className={styles.auth__link}>
                {linkText}
                <Link href={link}> here</Link>
            </p>
        </div>
    )
}

export default AuthLayout
