import Header from 'components/header'
import Footer from 'components/footer'

export default function Layout ({ children }) {
  return (
    <>
    <link href="//netdna.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css" rel="stylesheet" />
    <div className="p-4">
            <div className="container">
      <Header />
      <main>
        {children}
      </main>
      <Footer />
      </div>
        </div>
    </>
  )
}
