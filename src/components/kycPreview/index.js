import React from 'react'
import styles from './kycPreview.module.scss';
import Button from '../button';
const ProofImage = '/assets/images/proof.png';
const RightIcon = 'assets/icons/right.svg';
const Close = 'assets/icons/close.svg';
export default function KycPreview() {
    return (
        <div className={styles.kycPreview}>
            <div className={styles.modal}>
                <div className={styles.modalheader}>
                    <h2>
                        Mark Twain
                    </h2>
                    <p>
                        mail@mail.com
                    </p>
                </div>
                <div className={styles.modalBody}>
                    <div className={styles.twoCol}>
                        <div>
                            <p>
                                ID Proof (Front)
                            </p>
                            <img src={ProofImage} alt='ProofImage' />
                        </div>
                        <div>
                            <p>
                                ID Proof (Front)
                            </p>
                            <img src={ProofImage} alt='ProofImage' />
                        </div>
                    </div>
                    <div className={styles.twoCol}>
                        <div>
                            <p>
                                ID Proof (Front)
                            </p>
                            <img src={ProofImage} alt='ProofImage' />
                        </div>
                        <div>
                            <p>
                                ID Proof (Front)
                            </p>
                            <img src={ProofImage} alt='ProofImage' />
                        </div>
                    </div>
                    <div className={styles.buttonGrid}>
                        <Button icon={RightIcon} text="Approve KYC " />
                        <Button icon={Close} text="Reject KYC" primaryOutline />
                    </div>
                </div>
            </div>
        </div>
    )
}
