// import Home from '@/views/Catalogue/Home';
import {lazy, Suspense} from 'react';
import Home from "../views/Home";
import Page1 from "../views/Page1";
// import ViewLoading from '@/components/ViewLoading';
// import ViewLoading from "@/components/ViewLoading";

export default [
    {
        path: '/',
        element: <Home/>
    },
    {
        path: '/page1',
        element: <Page1/>
    }
]