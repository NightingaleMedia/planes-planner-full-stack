import { GetStaticProps, InferGetStaticPropsType } from 'next'

import { createSwaggerSpec } from 'next-swagger-doc'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

const SwaggerUI: any = dynamic(() => import('swagger-ui-react'), { ssr: false })

const ApiDoc = ({ spec }: InferGetStaticPropsType<typeof getStaticProps>) => {
    return <SwaggerUI spec={spec} />
}

export const getStaticProps: GetStaticProps = async ctx => {
    const spec: Record<string, any> = createSwaggerSpec({
        definition: {
            openapi: '3.0.0',
            info: {
                title: 'NextJS Swagger',
                version: '0.1.0',
            },
        },
    })
    return {
        props: {
            spec,
        },
    }
}

export default ApiDoc
