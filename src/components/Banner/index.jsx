import React, { useEffect } from 'react';
import qr from '../../assets/qr-code.svg';
import styles from './Banner.module.scss';

const Banner = ({ onClose }) => {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Enter') {
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [onClose]);
    return (
        <div className={styles.root}>
            <h4 className={styles.title}>
                ИСПОЛНИТЕ МЕЧТУ ВАШЕГО МАЛЫША! <br />
                ПОДАРИТЕ ЕМУ СОБАКУ!
            </h4>

            <img className={styles.qr} src={qr} alt='qr' />
            <p className={styles.text}>Сканируйте QR-код или нажмите ОК</p>

            <button onClick={onClose} className={styles.button} tabIndex='0'>
                ОК
            </button>
        </div>
    );
};

export default Banner;
