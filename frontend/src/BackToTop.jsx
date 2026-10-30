import { useState, useEffect } from 'react'

function BackToTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    function verifierScroll() {
      setVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', verifierScroll)
    return () => window.removeEventListener('scroll', verifierScroll)
  }, [])

  function remonter(e) {
    e.preventDefault()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <a
      href="#"
      className="back-to-top"
      style={{ display: visible ? 'block' : 'none' }}
      onClick={remonter}
    >
      <i className="fa fa-chevron-up"></i>
    </a>
  )
}

export default BackToTop
