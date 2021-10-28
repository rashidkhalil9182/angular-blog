export interface Comment {
    body: string;
    email: string;
    id: number;
    name: string;
    postId: 5;
}

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
    comments?: Comment[];
}
