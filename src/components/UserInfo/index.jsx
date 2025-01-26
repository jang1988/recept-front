import React from "react";
import styles from "./UserInfo.module.scss";
import { Avatar } from "@mui/material";

export const UserInfo = ({ avatarUrl, fullName, additionalText }) => {
    return (
        <div className={styles.root}>
            <Avatar alt={fullName} src={avatarUrl} style={{ marginRight: 10, width: 30, height: 30 }} />
            <div className={styles.userDetails}>
                <span className={styles.userName}>{fullName}</span>
                <span className={styles.additional}>{additionalText}</span>
            </div>
        </div>
    );
};
