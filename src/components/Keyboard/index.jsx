import React, { useState, useEffect, useRef } from 'react';
import InputMask from 'react-input-mask';
import styles from './Keyboard.module.scss';
import axios from 'axios';

const Keyboard = ({
    onOverlayClick,
    handleKeyboardSubmit,
    handleOverlayClose,
    handlePromoVideo,
}) => {
    const [phoneNumber, setPhoneNumber] = useState('+7 (   )    -  -  ');
    const [consent, setConsent] = useState(false);
    const inputRef = useRef(null);
    const elementsRef = useRef([]);
    const [focusedElementIndex, setFocusedElementIndex] = useState(0);
    const [isInactive, setIsInactive] = useState(false);
    const apiKey = 'tpLQvbn6rZu5O4Aenow8FbT4ySidEmeO';
    const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true);

    async function validateRussianPhoneNumber(phoneNumber) {
        try {
            const url = `https://api.apilayer.com/number_verification/validate?number=${phoneNumber}`;
            const headers = {
                apikey: apiKey,
            };

            const response = await axios.get(url, { headers });
            setIsPhoneNumberValid(response.data.valid);
        } catch (error) {
            setIsPhoneNumberValid(false);
            console.error('Error validating phone number:', error);
        }
    }

    useEffect(() => {
        const handleKeyboardEvent = (event) => {
            const { key } = event;
            switch (key) {
                case 'Enter': {
                    const focusedElement =
                        elementsRef.current[focusedElementIndex];
                    if (focusedElement) {
                        focusedElement.click();
                        setIsInactive(false);
                    }
                    break;
                }
                case 'Backspace': {
                    setPhoneNumber((prevPhoneNumber) =>
                        prevPhoneNumber.slice(0, -1)
                    );
                    setIsInactive(false);
                    break;
                }
                case 'ArrowUp': {
                    setIsInactive(false);
                    setFocusedElementIndex((prevIndex) => {
                        if (prevIndex >= 0 && prevIndex <= 2) {
                            return prevIndex + 7;
                        }
                        return prevIndex - 3;
                    });
                    break;
                }
                case 'ArrowDown': {
                    setIsInactive(false);
                    setFocusedElementIndex((prevIndex) => {
                        if (prevIndex === 13) {
                            return 0;
                        } else if (prevIndex === 8) {
                            return 10;
                        } else if (prevIndex === 9 || prevIndex === 10) {
                            return 11;
                        } else if (prevIndex === 11) {
                            return 12;
                        } else if (prevIndex === 12) {
                            return 13;
                        } else if (prevIndex >= 0 && prevIndex <= 2) {
                            return prevIndex + 3;
                        } else if (prevIndex >= 3 && prevIndex <= 5) {
                            return prevIndex + 3;
                        }
                        return prevIndex + 3;
                    });
                    break;
                }

                case 'ArrowLeft': {
                    setIsInactive(false);
                    setFocusedElementIndex((prevIndex) =>
                        prevIndex > 0
                            ? prevIndex - 1
                            : elementsRef.current.length - 1
                    );
                    break;
                }

                case 'ArrowRight': {
                    setIsInactive(false);
                    setFocusedElementIndex((prevIndex) =>
                        prevIndex < elementsRef.current.length - 1
                            ? prevIndex + 1
                            : 0
                    );
                    break;
                }

                default: {
                    if (/^[0-9]$/.test(key)) {
                        const numericalPhoneNumber = phoneNumber.replace(
                            /[^0-9]/g,
                            ''
                        );
                        if (numericalPhoneNumber.length < 11) {
                            setPhoneNumber(
                                (prevPhoneNumber) => prevPhoneNumber + key
                            );
                        }
                        if (numericalPhoneNumber.length === 10) {
                            validateRussianPhoneNumber(phoneNumber + key);
                        }
                        setIsInactive(false);
                    }
                    break;
                }
            }
        };
        // Если пользователь не активен, выполнияем переход на промо-видео
        const idleTimer = setTimeout(() => {
            if (!isInactive) {
                setIsInactive(true);
                handlePromoVideo();
            }
        }, 10000);

        window.addEventListener('keydown', handleKeyboardEvent);

        return () => {
            window.removeEventListener('keydown', handleKeyboardEvent);
            clearTimeout(idleTimer);
        };
    }, [
        handleKeyboardSubmit,
        onOverlayClick,
        phoneNumber,
        consent,
        focusedElementIndex,
        handlePromoVideo,
        isInactive,
    ]);

    const handleKeyClick = (key) => {
        const cleanedPhoneNumber = phoneNumber.replace(/[^+7\d]/g, '');
        if (cleanedPhoneNumber.length < 12) {
            setPhoneNumber((prevPhoneNumber) => prevPhoneNumber + key);
        }
        if (cleanedPhoneNumber.length === 11) {
            validateRussianPhoneNumber(phoneNumber + key);
        }
    };

    const handleClearClick = () => {
        setPhoneNumber('+7 (   )    -  -  ');
        setIsPhoneNumberValid(true);
    };

    const handleConsentChange = () => {
        setConsent((prevConsent) => !prevConsent);
    };

    const handleSubmitClick = () => {
        if (phoneNumber.replace(/[^0-9]/g, '').length === 11 && consent) {
            handleKeyboardSubmit();
        }
    };
    //Проверка кнопки "Подтвердить номер"
    const numericalPhoneNumber = phoneNumber.replace(/[^0-9]/g, '');
    const isPhoneNumberComplete = numericalPhoneNumber.length === 11;
    const isSubmitButtonDisabled =
        !isPhoneNumberValid || !consent || !isPhoneNumberComplete;

    return (
        <>
            <div className={styles.root}>
                <div className={styles.title}>
                    Введите ваш номер мобильного телефона
                </div>
                <InputMask
                    name='mask'
                    className={styles.input}
                    mask='+7 (999) 999-99-99'
                    maskChar='_'
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    inputRef={inputRef}
                />
                <div className={styles.text}>
                    и с Вами свяжется наш менеджер для дальнейшей консультации
                </div>
                <div className={styles.numbers}>
                    {['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].map(
                        (key, index) => (
                            <button
                                className={
                                    focusedElementIndex === index
                                        ? styles.focused
                                        : styles.number
                                }
                                key={key}
                                onClick={() => handleKeyClick(key)}
                                ref={(el) => (elementsRef.current[index] = el)}
                            >
                                {key}
                            </button>
                        )
                    )}

                    <button
                        className={
                            focusedElementIndex === 10
                                ? styles.clearFocused
                                : styles.clear
                        }
                        onClick={handleClearClick}
                        ref={(el) => (elementsRef.current[10] = el)}
                    >
                        Clear
                    </button>
                </div>
                {isPhoneNumberValid ? (
                    <label className={styles.label}>
                        <input
                            name='checkbox'
                            type='checkbox'
                            checked={consent}
                            onChange={handleConsentChange}
                        />
                        <span
                            className={
                                focusedElementIndex === 11
                                    ? styles.spanFocused
                                    : ''
                            }
                            ref={(el) => (elementsRef.current[11] = el)}
                        >
                            Согласие на обработку персональных данных
                        </span>
                    </label>
                ) : (
                    <div className={styles.errorText}>Неверно введён номер</div>
                )}
                <button
                    className={
                        isSubmitButtonDisabled
                            ? styles.disabled
                            : focusedElementIndex === 12
                            ? styles.focusedEnabled
                            : styles.enabled
                    }
                    onClick={handleSubmitClick}
                    disabled={isSubmitButtonDisabled}
                    ref={(el) => (elementsRef.current[12] = el)}
                >
                    Подтвердить номер
                </button>
            </div>
            <button
                className={
                    focusedElementIndex === 13
                        ? styles.focusedCloseBtn
                        : styles.closeBtn
                }
                onClick={handleOverlayClose}
                ref={(el) => (elementsRef.current[13] = el)}
            >
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

export default Keyboard;
