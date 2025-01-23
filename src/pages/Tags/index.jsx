import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';
import Pagination from '@mui/material/Pagination';

import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';

export const Tags = () => {
    const dispatch = useDispatch();
    const { tag } = useParams();
    const userData = useSelector((state) => state.auth.data);
    const { posts, tags } = useSelector((state) => state.posts);
    const { items: comments = [], status: commentsStatus } = useSelector(
        (state) => state.comments,
    );

    const [activeTab, setActiveTab] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const POSTS_PER_PAGE = 3;

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';
    const isCommentsLoading = commentsStatus === 'loading';

    React.useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
        setCurrentPage(1);
    };

    const handlePageChange = (event, value) => {
        setCurrentPage(value);
    };

    const filteredPosts = React.useMemo(() => {
        if (isPostsLoading) return [...Array(5)];
        return posts.items.filter((post) => post.tags.includes(tag));
    }, [posts.items, tag, isPostsLoading]);

    const sortedPosts = React.useMemo(() => {
        if (isPostsLoading) return [...Array(5)];
        return [...filteredPosts].sort((a, b) => {
            if (activeTab === 1) {
                return b.viewsCount - a.viewsCount;
            }
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
    }, [filteredPosts, activeTab, isPostsLoading]);

    const paginatedPosts = React.useMemo(() => {
        const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
        return sortedPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
    }, [sortedPosts, currentPage]);

    return (
        <>
            <Tabs style={{ marginBottom: 15 }} value={activeTab} onChange={handleTabChange}>
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <TagsBlock items={tags.items} isLoading={isTagsLoading} />
            <Grid xs={8} item>
                {paginatedPosts.map((obj, index) =>
                    isPostsLoading ? (
                        <Post key={index} isLoading={true} />
                    ) : (
                        <Post
                            key={obj._id}
                            id={obj._id}
                            title={obj.title}
                            imageUrl={obj.imageUrl ? obj.imageUrl : ''}
                            user={obj.user}
                            createdAt={obj.createdAt}
                            viewsCount={obj.viewsCount}
                            commentsCount={3}
                            tags={obj.tags}
                            isEditable={userData?._id === obj.user._id}
                        />
                    ),
                )}

                <Pagination
                    count={Math.ceil(sortedPosts.length / POSTS_PER_PAGE)}
                    page={currentPage}
                    onChange={handlePageChange}
                    style={{ display: 'flex', justifyContent: 'center', margin: 20 }}
                />
            </Grid>
            <Grid xs={4} item>
                <CommentsBlock
                    items={isCommentsLoading ? [] : comments.slice(0, 5)}
                    isLoading={isCommentsLoading}
                />
            </Grid>
        </>
    );
};
