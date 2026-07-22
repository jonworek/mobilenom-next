import Link from "next/link";

const Arrow = () => <span aria-hidden="true">↗</span>;

export default function Home() {
  return (
    <main className="home">
      <nav className="nav shell">
        <Link className="brand" href="/">
          <span>MN</span> mobile nom
        </Link>
        <div className="nav-links">
          <Link href="/nearby">Find food</Link>
          <a href="#owners">For truck owners</a>
        </div>
        <Link className="button button-small" href="/nearby">
          Open the map <Arrow />
        </Link>
      </nav>

      <section className="hero shell">
        <div className="eyebrow"><i /> Live food, wherever you are</div>
        <h1>
          Follow the <em>good food.</em>
          <br />It&apos;s moving.
        </h1>
        <p className="hero-copy">
          Mobile Nom makes your local food-truck scene feel like it&apos;s right
          around the corner—because it is.
        </p>
        <div className="hero-actions">
          <Link className="button" href="/nearby">
            Find food trucks <Arrow />
          </Link>
          <a className="text-link" href="#owners">
            I run a truck <span>↓</span>
          </a>
        </div>
        <div className="hero-map-card">
          <div className="map-grid" />
          <div className="map-street street-one" />
          <div className="map-street street-two" />
          <div className="map-pin pin-one"><b>🍜</b><span>Open now</span></div>
          <div className="map-pin pin-two">🌮</div>
          <div className="map-pin pin-three">🍔</div>
          <div className="map-note">
            <strong>12</strong>
            <span>trucks nearby<br />and serving</span>
          </div>
        </div>
      </section>

      <section className="intro shell">
        <p>THE BETTER WAY TO EAT LOCAL</p>
        <h2>From curbside cravings<br />to your next favorite meal.</h2>
        <div className="intro-copy">
          <span>01</span>
          <p>
            Food trucks are where the interesting stuff happens. We make them
            easy to find, easy to follow, and impossible to forget.
          </p>
        </div>
      </section>

      <section className="features shell">
        <article>
          <span className="feature-number">01</span>
          <div className="feature-icon">⌖</div>
          <h3>Find what&apos;s firing</h3>
          <p>See who&apos;s open, what&apos;s nearby, and exactly where they&apos;re parked—right now.</p>
        </article>
        <article>
          <span className="feature-number">02</span>
          <div className="feature-icon">♡</div>
          <h3>Keep your favorites close</h3>
          <p>Follow the trucks you love and never miss their next stop, special, or late-night pop-up.</p>
        </article>
        <article>
          <span className="feature-number">03</span>
          <div className="feature-icon">◎</div>
          <h3>Eat your city</h3>
          <p>Discover the flavors, people, and tiny kitchens that make your neighborhood taste like home.</p>
        </article>
      </section>

      <section className="owners" id="owners">
        <div className="owners-inner shell">
          <div>
            <p className="eyebrow light"><i /> Built for the people behind the window</p>
            <h2>Your best customers<br />are looking for you.</h2>
          </div>
          <div>
            <p>
              Turn a moving business into a familiar local favorite. Publish
              your live location, share your schedule, and give hungry people
              a reason to come find you.
            </p>
            <a className="button button-light" href="https://www.mobilenom.com/signup">
              Put your truck on the map <Arrow />
            </a>
          </div>
        </div>
      </section>

      <footer className="shell">
        <Link className="brand" href="/"><span>MN</span> mobile nom</Link>
        <p>Real food. In motion.</p>
        <Link href="/nearby">Explore nearby trucks ↗</Link>
      </footer>
    </main>
  );
}
