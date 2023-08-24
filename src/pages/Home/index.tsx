import PageHeader from "../../components/PageHeader";
import PageFooter from "../../components/PageFooter";


function Home() {
  
    return (
      <>
        <PageHeader title={'Home'} text={"Application's home"}/>
        <h1>Home Page</h1>
        <PageFooter text={"Home Footer"}/>
      </>
    );
}

export default Home