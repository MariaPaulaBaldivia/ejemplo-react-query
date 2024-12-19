import { fetchTime } from "./services/TimeService"
import { useQuery } from '@tanstack/react-query';

export const FetchTime = () => {
    const {data, isLoading, isError} = useQuery({
        queryKey: ['time'],
        queryFn: fetchTime,
        refetchInterval: 5000
    });

    if (isLoading) return <p>Cargando hora ...</p>;
    if (isError) return <p>Error al cargar la hora.</p>;
    
    return (
        <>
            <p style={{ color: 'red', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>{data?.countryName}</p>
            <p style={{ color: 'red', fontFamily: 'Arial, sans-serif', fontSize: '16px' }}>{data?.formatted}</p>
        </>
    )
}