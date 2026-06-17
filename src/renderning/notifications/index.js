import React from 'react'
import styles from './notifications.module.scss';
import Input from '@/components/input';
import Textarea from '@/components/textarea';
import Button from '@/components/button';
import GalleryView from '@/svg/galleryView';
const RightIcon = 'assets/icons/right.svg';
const CloseIcon = 'assets/icons/close.svg';

export default function Notifications() {
    return (
        <div className={styles.notifications}>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.boxHeader}>
                        <h2>
                            Send Notification
                        </h2>
                    </div>
                    <div className={styles.boxBody}>
                        <Input spacingRemove label='Notification Title' />
                        <Textarea label="Content" />
                        <div className={styles.buttonGrid}>
                            <Button text="Send" icon={RightIcon} />
                            <Button text="Cancel" icon={CloseIcon} primaryOutline />
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.items}>
                <div className={styles.box}>
                    <div className={styles.boxHeader}>
                        <h2>
                            Send Popup
                        </h2>
                    </div>
                    <div className={styles.boxBody}>
                        <div className={styles.uplodBox}>
                            <label>
                                Upload Image
                            </label>
                            <div className={styles.upload}>
                                <div>
                                    <div className={styles.iconCenter}>
                                        <GalleryView />
                                    </div>
                                    <p>
                                        Minimum 1280X720 px
                                    </p>
                                    <p>PNG or JPG. Upto 3 MB</p>
                                </div>
                            </div>
                        </div>
                        <Input spacingRemove label='URL' />
                        <div className={styles.buttonGrid}>
                            <Button text="Send" icon={RightIcon} />
                            <Button text="Cancel" icon={CloseIcon} primaryOutline />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
