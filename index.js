const convertToApiUrl = (url) => {
  return url.replace(/https:\/\/github.com\/(.*)\/(.*)/i, (_, name, repo) => (
    `https://api.github.com/repos/${name}/${repo}`
  ));
}

const initialLibraries = [
  {
    name: 'React',
    repository: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    homepage: 'https://facebook.github.io/react/',
    readmeURL: 'https://api.github.com/repos/facebook/react/readme',
    avatar: 'https://avatars.githubusercontent.com/u/69631?v=3',
    stats: {
      createdAt: '2013-05-24T16:15:54Z',
      updatedAt: '2017-01-10T14:48:28Z',
      stars: 57344,
      forks: 10377,
      issues: 675,
      watchers: 4018,
    },
    lastUpdated: '',
  }, {
    name: 'Redux',
    repository: 'reactjs/redux',
    description: 'Predictable state container for JavaScript apps',
    homepage: 'http://redux.js.org',
    readmeURL: 'https://api.github.com/repos/reactjs/redux/readme',
    avatar: 'https://avatars.githubusercontent.com/u/6412038?v=3',
    stats: {
      createdAt: '2015-05-29T23:53:15Z',
      updatedAt: '2017-01-10T14:48:28Z',
      stars: 27118,
      forks: 4816,
      issues: 35,
      watchers: 1122,
    },
    lastUpdated: '',
  }, {
    name: 'Ionic',
    repository: 'driftyco/ionic',
    description: 'Build amazing native and progressive web apps with Angular and open web technologies. One app running on everything 🎉',
    homepage: 'http://ionicframework.com/',
    readmeURL: 'https://api.github.com/repos/driftyco/ionic/readme',
    avatar: 'https://avatars.githubusercontent.com/u/3171503?v=3',
    stats: {
      createdAt: '2014-09-18T16:12:01Z',
      updatedAt: '2017-01-10T15:36:46Z',
      stars: 27437,
      forks: 6446,
      issues: 919,
      watchers: 1675,
    },
    lastUpdated: '',
  }, {
    name: 'Moment',
    repository: 'moment/moment',
    description: 'Parse, validate, manipulate, and display dates in javascript.',
    homepage: 'http://momentjs.com',
    readmeURL: 'https://api.github.com/repos/moment/moment/readme',
    avatar: 'https://avatars.githubusercontent.com/u/4129662?v=3',
    stats: {
      createdAt: '2011-03-01T02:46:06Z',
      updatedAt: '2017-01-10T16:18:25Z',
      stars: 29416,
      forks: 4225,
      issues: 206,
      watchers: 878,
    },
    lastUpdated: '',
  }, {
    name: 'Meteor',
    repository: 'meteor/meteor',
    description: 'Meteor, the JavaScript App Platform',
    homepage: 'https://www.meteor.com',
    readmeURL: 'https://api.github.com/repos/meteor/meteor/readme',
    avatar: 'https://avatars.githubusercontent.com/u/789528?v=3',
    stats: {
      createdAt: '2012-01-19T01:58:17Z',
      updatedAt: '2017-01-10T16:17:08Z',
      stars: 36436,
      forks: 4539,
      issues: 787,
      watchers: 1943,
    },
    lastUpdated: '',
  }, {
    name: 'Vue',
    repository: 'vuejs/vue',
    description: 'A progressive, incrementally-adoptable JavaScript framework for building UI on the web.',
    homepage: 'http://vuejs.org',
    readmeURL: 'https://api.github.com/repos/vuejs/vue/readme',
    avatar: 'https://avatars.githubusercontent.com/u/6128107?v=3',
    stats: {
      createdAt: '2013-07-29T03:24:51Z',
      updatedAt: '2017-01-10T16:35:55Z',
      stars: 39156,
      forks: 4805,
      issues: 69,
      watchers: 2267,
    },
    lastUpdated: '',
  },
];

const Modal = (props) => (
  <div className="modal-overlay">
    <div className="modal">
      <button
        className="modal__btn modal__btn--close"
        onClick={props.onClose}
        aria-label="Close"
      >&times;</button>
      {props.children}
    </div>
  </div>
);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      libraries: props.initialLibraries,
      isModalOpen: false,
    };
    this.filterResults = this.filterResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.onEscape = this.onEscape.bind(this);
  }
  componentDidMount() {
    addEventListener('keydown', this.onEscape);
  }
  componentWillUnmount() {
    removeEventListener('keydown', this.onEscape);
  }
  filterResults(item) {
    if (this.state.searchTerm) {
      const regex = new RegExp(this.state.searchTerm.trim(), 'gi');
      return (item.name.match(regex) ||
        item.description.match(regex) ||
        item.repository.match(regex));
    }
    return true;
  }
  handleChange(searchTerm) {
    this.setState({ searchTerm });
  }
  handleSubmit(url) {
    axios.get(convertToApiUrl(url))
    .then(res => res.data)
    .then(res => ({
      id: res.id,
      name: res.name,
      repository: res.full_name,
      description: res.description,
      homepage: res.homepage,
      readmeURL: `${res.url}/readme`,
      avatar: res.owner.avatar_url,
      stats: {
        createdAt: res.created_at,
        updatedAt: res.pushed_at,
        stars: res.watchers_count,
        forks: res.forks,
        issues: res.open_issues,
        watchers: res.subscribers_count,
      },
      lastUpdated: '',
    }))
    .then(repo => {
      this.setState(prevState => ({
        libraries: [repo, ...prevState.libraries],
        searchTerm: '',
        isModalOpen: false,
      }))
    });
  }
  openModal() {
    this.setState({
      isModalOpen: true,
    })
  }
  closeModal() {
    this.setState({
      isModalOpen: false,
    })
  }
  onEscape(e) {
    if (e.keyCode === 27) {
      this.closeModal();
    }
  }
  render() {
    const listItems = this.state.libraries
      .filter(this.filterResults)
      .map(item => (
        <li key={item.repository} className="library">
          <img className="library__image" src={item.avatar} />
          <section>
            <h2 className="library__name">{item.name}</h2>
            <div className="library__description">
              {item.description}
            </div>
          </section>
        </li>
      ));
    return (
      <div>
        <div className="large-hero">
          <div className="container container--small">
            <div className="logo">JS</div>
            <h1 className="large-hero__title">Find the Best JavaScript Libraries and Frameworks</h1>
            <section className="search-bar">
              <SearchForm handleChange={this.handleChange} />
            </section>
          </div>
        </div>
        <ul className="libraries">
          {listItems}
        </ul>
        {this.state.isModalOpen && (
          <Modal onClose={this.closeModal}>
            <h2 className="modal__title">Add a New Library</h2>
            <div className="modal__content">
              <p>Can't see your library listed?</p>
              <p>Just type or paste your GitHub repo's URL below!</p>
            </div>
            <SubmitForm handleSubmit={this.handleSubmit}/>
          </Modal>
        )}
        <button
          className="btn btn--add"
          onClick={this.openModal}
          type=""
          aria-label="Add Library"
        >+</button>
      </div>
    );
  }
}

class SearchForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: '',
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  handleChange(event) {
    const value = event.target.value;
    this.setState({
      value,
    });
    this.props.handleChange(value);
  }
  handleSubmit(event) {
    event.preventDefault();
  }
  render() {
    return (
      <form
        className="form form--search"
        onSubmit={this.handleSubmit}
      >
        <input
          className="form__field form__field--search"
          type="search"
          placeholder="Search JS libraries and frameworks"
          defaultValue={this.state.value}
          onChange={this.handleChange}
        />
      </form>
    );
  }
}

SearchForm.propTypes = {
  handleChange: React.PropTypes.func.isRequired,
}

class SubmitForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      repo: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  componentDidMount() {
    this.inputRef.focus();
  }
  handleChange(event) {
    this.setState({
      repo: event.target.value,
    });
  }
  handleSubmit(event) {
    event.preventDefault();
    this.props.handleSubmit(this.state.repo);
  }
  render() {
    return (
      <form
        className="form form--submit"
        onSubmit={this.handleSubmit}
      >
        <input
          className="form__field form__field--submit"
          type="url"
          placeholder="Enter a valid GitHub link"
          defaultValue={this.state.repo}
          onChange={this.handleChange}
          ref={node => { this.inputRef = node; }}
        />
        <button
          className="btn btn--submit"
          type="submit"
        >Add Library</button>
      </form>
    );
  }
}

SubmitForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
}

ReactDOM.render(
  <App initialLibraries={initialLibraries}/>,
  document.getElementById('app')
);
