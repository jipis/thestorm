import { useGetUserQuery } from 'services/user';

const RtkTesting = () => {
  const { data, error, isLoading } = useGetUserQuery();
  console.log({ data, error, isLoading });
  return (
    <div className="rtk-test">
      {error ? (
        <>Oh no, there was an error</>
      ) : isLoading ? (
        <>isLoading...</>
      ) : data ? (
        <>
          <h3>This is the data</h3>
          <p>{data}</p>
        </>
      ) : null}
    </div>
  );
};

export default RtkTesting;
