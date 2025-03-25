import { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    FacebookShareButton,
    TwitterShareButton,
    WhatsappShareButton,
    TelegramShareButton,
    FacebookIcon,
    XIcon,
    WhatsappIcon,
    TelegramIcon
} from 'react-share';

// Componente intermedio para filtrar props no válidas
const SafeShareButton = ({ children }) => {
    return <div className="cursor-pointer">{children}</div>;
};

SafeShareButton.propTypes = {
    children: PropTypes.node.isRequired,
};

const ShareMenu = ({ url, title, isOpen, onClose }) => {
    const menuRef = useRef();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose();
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div ref={menuRef} className="absolute bottom-full mb-2 rounded-lg shadow-lg p-4 bg-white dark:bg-gray-800">
            <div className="flex space-x-4">
                <SafeShareButton>
                    <FacebookShareButton url={url} quote={title}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                </SafeShareButton>
                <SafeShareButton>
                    <TwitterShareButton url={url} title={title}>
                        <XIcon size={32} round />
                    </TwitterShareButton>
                </SafeShareButton>
                <SafeShareButton>
                    <WhatsappShareButton url={url} title={title}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </SafeShareButton>
                <SafeShareButton>
                    <TelegramShareButton url={url} title={title}>
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                </SafeShareButton>
            </div>
        </div>
    );
};

ShareMenu.propTypes = {
    url: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
};

export { ShareMenu };