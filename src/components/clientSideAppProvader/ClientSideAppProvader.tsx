'use client';
import { ConfigProvider } from "antd";
import { useServerInsertedHTML } from 'next/navigation';
import { useState } from "react";
import { ServerStyleSheet, StyleSheetManager } from 'styled-components';


export const ClientSideAppProvader: React.FC<{
    children: React.ReactNode;
}> = ({ children }) => {
    const [styledComponentsStyleSheet] = useState(() => new ServerStyleSheet())

    useServerInsertedHTML(() => {
        const style = styledComponentsStyleSheet.getStyleElement();
        styledComponentsStyleSheet.instance.clearTag();
        return <>{style}</>
    })

    return (
        <ConfigProvider
            theme={{
                token: {
                    colorPrimary: '',
                    fontFamily: ''
                }
            }}
        >
            {typeof window === 'undefined' ? (
                <StyleSheetManager sheet={styledComponentsStyleSheet.instance}>
                    {children as React.ReactChild}
                </ StyleSheetManager>

            ) : (<>{children}</>)}

        </ConfigProvider>
    )
}


