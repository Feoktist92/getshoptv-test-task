import React, { useEffect, useRef, useState } from 'react';
import Banner from './components/Banner';
import Qr from './components/Qr';
import Keyboard from './components/Keyboard';
import Success from './components/Success';
import video from '../src/assets/video.mp4';

const App: React.FC = () => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [showBanner, setShowBanner] = useState(false);
    const [showOverlay, setShowOverlay] = useState(false);
    const [isRequestSent, setIsRequestSent] = useState(false);
    const [currentComponent, setCurrentComponent] = useState<string>('');
    const [currentBanner, setCurrentBanner] = useState<string>('banner');

    useEffect(() => {
        const videoElement = videoRef.current;

        const bannerTimer = setTimeout(() => {
            setShowBanner(true);
        }, 5000);

        videoElement?.addEventListener('ended', () => {
            setShowBanner(false);
        });

        const handleKeyEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (
                    currentComponent === 'Keyboard' ||
                    currentComponent === 'Success'
                ) {
                    setCurrentComponent('');
                    setShowOverlay(false);
                    if (!isRequestSent) {
                        setCurrentBanner('banner');
                    }
                }
                videoElement?.play();
            }
        };

        window.addEventListener('keydown', handleKeyEscape);

        return () => {
            clearTimeout(bannerTimer);
            videoElement?.removeEventListener('ended', () => {
                setShowBanner(false);
            });
            window.removeEventListener('keydown', handleKeyEscape);
        };
    }, [showOverlay, currentComponent, isRequestSent]);

    const handleOkClick = () => {
        videoRef.current?.pause();
        setCurrentComponent('Keyboard');
        setShowOverlay(true);
        if (!isRequestSent) {
            setCurrentBanner('qr');
        }
    };

    const handleKeyboardSubmit = () => {
        setCurrentComponent('Success');
        setShowOverlay(true);
        setIsRequestSent(true);
    };

    const handleOverlayClose = () => {
        videoRef.current?.play();
        setCurrentComponent('');
        if (!isRequestSent) {
            setCurrentBanner('banner');
        }
    };

    const handlePromoVideo = () => {
        if (currentComponent === 'Keyboard' && !isRequestSent) {
            videoRef.current?.play();
            setCurrentComponent('');
            setCurrentBanner('banner');
        }
    };

    return (
        <div className='wrapper'>
            <video
                ref={videoRef}
                style={{
                    width: '100%',
                    height: '100%',
                    transform: 'scaleX(1.12)',
                }}
                autoPlay
                muted
            >
                <source src={video} type='video/mp4' />
            </video>
            {showBanner && (
                <div>
                    {currentBanner === 'banner' ? (
                        <Banner onClose={handleOkClick} />
                    ) : (
                        <Qr />
                    )}
                </div>
            )}
            {showOverlay &&
                currentComponent === 'Keyboard' ? (
                    <Keyboard
                        onOverlayClick={() => setCurrentComponent('Success')}
                        handleKeyboardSubmit={handleKeyboardSubmit}
                        handleOverlayClose={handleOverlayClose}
                        handlePromoVideo={handlePromoVideo}
                    />
                ) : currentComponent === 'Success' ? (
                    <Success handleOverlayClose={handleOverlayClose} />
                ) : null}
        </div>
    );
};

export default App;
