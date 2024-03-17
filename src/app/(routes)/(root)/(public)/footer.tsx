export default function Footer() {
    let currentTime = new Date();
    const year = currentTime.getFullYear();

    return (
     <div className="footer container p-4">
        <p className="text-center m-0">© {year} yoursite</p>
     </div>
    )
  }
  