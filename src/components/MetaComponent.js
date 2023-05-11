import { Helmet, HelmetProvider } from "react-helmet-async"


const MetaComponent = ({ title="Soft SAGA", description="Best Online Shop" }) => {
    return (
        <HelmetProvider>
            <Helmet>
                <title>{title}</title>
                <meta name="description" content={description} />
            </Helmet>
        </HelmetProvider>
    )
}

export default MetaComponent;
