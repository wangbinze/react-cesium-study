// import Home from '@/views/Catalogue/Home';
import {lazy, Suspense} from 'react';
import Home from "../views/Home";
import Lesson1 from "../views/Lesson1";
import Lesson2 from "../views/Lesson2";
import Lesson3 from "../views/Lesson3";

// import ViewLoading from '@/components/ViewLoading';
// import ViewLoading from "@/components/ViewLoading";

export default [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/lesson1',
        element: <Lesson1/>
    },
    {
        path: '/lesson2',
        element: <Lesson2/>
    },
    {
        path: '/lesson3',
        element: <Lesson3/>
    },
]