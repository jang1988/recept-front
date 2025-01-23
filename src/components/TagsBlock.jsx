import React from 'react';
import TagIcon from '@mui/icons-material/Tag';
import Skeleton from '@mui/material/Skeleton';

import { SideBlock } from './SideBlock';
import { Link } from 'react-router-dom';
import { Box, Chip } from '@mui/material';

export const TagsBlock = ({ items, isLoading = true }) => {
    return (
        <SideBlock title="Категории">
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'center', padding: 2 }}>
                {(isLoading ? [...Array(5)] : items).map((name, i) => (
                    <Link
                        style={{ textDecoration: 'none', color: 'black' }}
                        to={`/tags/${name}`}
                        key={i}
                    >
                        <Chip
                            icon={<TagIcon />}
                            label={isLoading ? <Skeleton width={100} /> : name}
                            variant="outlined"
                            style={{ cursor: 'pointer', fontSize: 16 }}
                        />
                    </Link>
                ))}
            </Box>
        </SideBlock>
    );
};
