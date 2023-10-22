import React from 'react';
import qr from '../../assets/qr-code-small.svg';
import styles from './Qr.module.scss';

const Qr = () => {
    return (
        <div className={styles.root}>
            <p className={styles.text}>
                Сканируйте QR-код ДЛЯ ПОЛУЧЕНИЯ ДОПОЛНИТЕЛЬНОЙ ИНФОРМАЦИИ
            </p>
            <img src={qr} alt='QR' width={110} height={110} />
        </div>
    );
};

export default Qr;
