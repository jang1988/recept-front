import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../components/Post';
import { TagsBlock } from '../components/TagsBlock';
import { CommentsBlock } from '../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../redux/slices/posts';
import { fetchComments } from '../redux/slices/comments'; // Assume you create this action

export const Home = () => {
    const dispatch = useDispatch();
    const userData = useSelector((state) => state.auth.data);
    const { posts, tags } = useSelector((state) => state.posts);
    const comments = useSelector((state) => state.comments.items); // Assuming state.comments contains the comments

    const [activeTab, setActiveTab] = React.useState(0); // Состояние для активной вкладки

    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';
    const isCommentsLoading = comments.status === 'loading'; // Track loading state for comments

    React.useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
        dispatch(fetchComments()); // Dispatch the action to fetch comments
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    // Сортировка постов на основе активной вкладки
    const sortedPosts = React.useMemo(() => {
        if (isPostsLoading) return [...Array(5)];
        return [...posts.items].sort((a, b) => {
            if (activeTab === 1) {
                return b.viewsCount - a.viewsCount; // Сортировка по убыванию просмотров
            }
            return new Date(b.createdAt) - new Date(a.createdAt); // Сортировка по новизне
        });
    }, [posts.items, activeTab, isPostsLoading]);

    return (
        <>
            <Tabs
                style={{ marginBottom: 15 }}
                value={activeTab}
                onChange={handleTabChange}
            >
                <Tab label="Новые" />
                <Tab label="Популярные" />
            </Tabs>
            <Grid container spacing={4}>
                <Grid xs={8} item>
                    {sortedPosts.map((obj, index) =>
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
                </Grid>
                <Grid xs={4} item>
                    <TagsBlock items={tags.items} isLoading={isTagsLoading} />
                    <CommentsBlock
                        items={isCommentsLoading ? [] : comments} // Load comments or show empty array if loading
                        isLoading={isCommentsLoading}
                    />
                </Grid>
            </Grid>
        </>
    );
};
