import "tailwindcss/tailwind.css";

function MyApp({ Component, pageProps }) {
  return (
    <>
      <style global jsx>{`
        html,
        body,
        body > div:first-child,
        div#__next,
        div#__next > div {
          height: 100%;
          background-color: #64cc9e;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
