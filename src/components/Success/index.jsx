import React from 'react';
import styles from './Success.module.scss';

const Success = ({ handleOverlayClose }) => {
    return (
        <>
            <div className={styles.root}>
                <h1 className={styles.title}>ЗАЯВКА ПРИНЯТА</h1>
                <p className={styles.text}>
                    Держите телефон под рукой.
                    <br />
                    Скоро с Вами свяжется наш менеджер.
                </p>
            </div>
            <button className={styles.closeBtn} onClick={handleOverlayClose}>
                <svg
                    xmlns='http://www.w3.org/2000/svg'
                    width='32'
                    height='32'
                    viewBox='0 0 32 32'
                    fill='none'
                    stroke='black'
                    strokeWidth='3'
                    strokeLinecap='square'
                    strokeLinejoin='miter'
                >
                    <line x1='24' y1='8' x2='8' y2='24' />
                    <line x1='8' y1='8' x2='24' y2='24' />
                </svg>
            </button>
        </>
    );
};

export default Success;
