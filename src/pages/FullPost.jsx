import React from 'react';
import { useParams } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import axios from '../axios';

import { Post } from '../components/Post';
import { Index } from '../components/AddComment';
import { CommentsBlock } from '../components/CommentsBlock';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAuthMe } from '../redux/slices/auth';

export const FullPost = () => {
    const [data, setData] = React.useState();
    const [comments, setComments] = React.useState([]);
    const [isLoading, setLoading] = React.useState(true);
    const user = useSelector((state) => state.auth.data);
    const { id } = useParams();
    const dispatch = useDispatch();

    React.useEffect(() => {
        dispatch(fetchAuthMe());
    }, [dispatch]);

    React.useEffect(() => {
        axios
            .get(`/posts/${id}`)
            .then((res) => {
                setData(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.warn(err);
                alert('Ошибка при получении статьи');
            });

        axios
            .get(`/posts/${id}/comments`)
            .then((res) => setComments(res.data))
            .catch((err) => console.warn('Ошибка при загрузке комментариев:', err));
    }, [id]);

    const handleAddComment = (newComment) => {
        setComments((prev) => [...prev, newComment]);
    };

    if (isLoading) {
        return <Post isLoading={isLoading} isFullPost />;
    }

    return (
        <>
            <Post
                id={data._id}
                title={data.title}
                imageUrl={data.imageUrl || ''}
                user={data.user}
                createdAt={data.createdAt}
                viewsCount={data.viewsCount}
                commentsCount={comments.length}
                tags={data.tags}
                isFullPost
            >
                <ReactMarkdown children={data.text} />
            </Post>
            <CommentsBlock items={comments} isLoading={false}>
                <Index
                    postId={id}
                    onAddComment={handleAddComment}
                    imageUrl={user.avatarUrl}
                    fullName={user.fullName}
                />
            </CommentsBlock>
        </>
    );
};
