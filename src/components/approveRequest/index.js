import React from 'react'
import styles from './approveRequest.module.scss';
import GalleryView from '@/svg/galleryView';
import Button from '../button';
const RightIcon = 'assets/icons/right.svg';
const CloseIcon = 'assets/icons/close.svg';
export default function ApproveRequest() {
    return (
        <div className={styles.approveRequest}>
            <div className={styles.modalheader}>
                <div>
                    <h2>
                        Approve Request?
                    </h2>
                    <p>
                        Provide Proof of Transfer
                    </p>
                </div>
                <div className={styles.rightAlignment}>
                    <CloseIcon />
                </div>
            </div>
            <div className={styles.boxbody}>
                <div className={styles.uplodBox}>
                    <label>
                        Upload Screenshot
                    </label>
                    <div className={styles.upload}>
                        <div>
                            <div className={styles.iconCenter}>
                                <GalleryView />
                            </div>

                            <p>PNG or JPG. Upto 3 MB</p>
                        </div>
                    </div>
                </div>
                <div className={styles.buttonGrid}>
                    <Button text="Send" icon={RightIcon} />
                    <Button text="Cancel" icon={CloseIcon} primaryOutline />
                </div>
            </div>
        </div>
    )
}
