import "../styles/information.css"

function Information() {
  return (
    <div className="information-container">
      <h1 className="name">Nikita Vassiljev</h1>

      <ul className="interests-list">
        <li>Full-Stack Developing</li>
        <li>Exploring something new</li>
        <li>Learning new technologies</li>
        <li>Reading technical literature</li>
        <li>Gaming</li>
      </ul>

      <form className="contact-form">
        <div className="form-group">
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="your.email@example.com"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">Your message:</label>
          <textarea
            id="message"
            name="message"
            rows={4}
            placeholder="Enter your message..."
            className="form-textarea"
          />
        </div>

        <button
          type="button"
          className="cta-button"
        >
          Send message
        </button>
      </form>
    </div>
  )
}

export default Information
