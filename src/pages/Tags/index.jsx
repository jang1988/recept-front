import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post } from '../../components/Post';
import { TagsBlock } from '../../components/TagsBlock';
import { CommentsBlock } from '../../components/CommentsBlock';
import { fetchPosts, fetchTags } from '../../redux/slices/posts';
import { useParams } from 'react-router-dom';

export const Tags = () => {
    const dispatch = useDispatch();
    const { tag } = useParams();
    const userData = useSelector((state) => state.auth.data);
    const { posts, tags } = useSelector((state) => state.posts);
    const [activeTab, setActiveTab] = React.useState(0); // Состояние для активной вкладки
    const isPostsLoading = posts.status === 'loading';
    const isTagsLoading = tags.status === 'loading';

    React.useEffect(() => {
        dispatch(fetchPosts());
        dispatch(fetchTags());
    }, [dispatch]);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    const filteredPosts = React.useMemo(() => {
        if (isPostsLoading) return [...Array(5)];
        return posts.items.filter((post) => post.tags.includes(tag));
    }, [posts.items, tag, isPostsLoading]);

    // Сортировка отфильтрованных постов на основе активной вкладки
    const sortedPosts = React.useMemo(() => {
        if (isPostsLoading) return [...Array(5)];
        return [...filteredPosts].sort((a, b) => {
            if (activeTab === 1) {
                return b.viewsCount - a.viewsCount; // Сортировка по убыванию просмотров
            }
            return new Date(b.createdAt) - new Date(a.createdAt); // Сортировка по новизне
        });
    }, [filteredPosts, activeTab, isPostsLoading]);

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
                        items={[
                            {
                                user: {
                                    fullName: 'Вася Пупкин',
                                    avatarUrl: 'https://mui.com/static/images/avatar/1.jpg',
                                },
                                text: 'Это тестовый комментарий',
                            },
                            {
                                user: {
                                    fullName: 'Иван Иванов',
                                    avatarUrl: 'https://mui.com/static/images/avatar/2.jpg',
                                },
                                text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top',
                            },
                        ]}
                        isLoading={false}
                    />
                </Grid>
            </Grid>
        </>
    );
};
