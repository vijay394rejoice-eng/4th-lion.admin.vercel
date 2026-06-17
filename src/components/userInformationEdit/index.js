import React from 'react'
import styles from './userInformationEdit.module.scss';
import CloseIcon from '@/svg/closeIcon';
import Button from '../button';
import Input from '../input';
const RightIcon = 'assets/icons/right.svg';
const Close = 'assets/icons/close.svg';

export default function UserInformationEdit() {
    return (
        <div className={styles.userInformationEdit}>
            <div className={styles.modal}>
                <div className={styles.modalheader}>
                    <div>
                        <h2>
                            Mark Twain
                        </h2>
                        <p>
                            mail@mail.com
                        </p>
                    </div>
                    <div className={styles.rightAlignment}>
                        <CloseIcon />
                    </div>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.colgrid}>
                        <Input label='Field 1' spacingRemove />
                        <Input label='Field 2' spacingRemove />
                        <div className={styles.column}>
                            <Input label='Field 3' spacingRemove />
                        </div>
                        <Input label='Field 4' spacingRemove />
                        <Input label='Field 5' spacingRemove />
                        <Input label='Field 6' spacingRemove />
                        <Input label='Field 7' spacingRemove />
                        <Input label='Field 8' spacingRemove />
                        <Input label='Field 9' spacingRemove />
                    </div>
                    <div className={styles.buttonGrid}>
                        <Button icon={RightIcon} text="Save" />
                        <Button icon={Close} text="Cancel" primaryOutline />
                    </div>
                </div>
            </div>
        </div>
    )
}
