function convertToApiUrl(url) {
  return url.replace(/https:\/\/github.com\/(.*)\/(.*)/i, (m, name, repo) => (
    `https://api.github.com/repos/${name}/${repo}`
  ));
}

const libraries = [
  {
    name: 'React',
    repository: 'facebook/react',
    description: 'A declarative, efficient, and flexible JavaScript library for building user interfaces.',
    homepage: 'https://facebook.github.io/react/',
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

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchTerm: '',
      libraries,
    };
    this.filterResults = this.filterResults.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
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
    .then(res => {console.log(res); return res.data;})
    .then(res => ({
      id: res.id,
      name: res.name,
      repository: res.full_name,
      description: res.description,
      homepage: res.homepage,
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
        libraries: [...prevState.libraries, repo],
      }))
    });
  }
  openModal() {
    //
  }
  render() {
    const listItems = this.state.libraries
    .filter(this.filterResults)
    .map(item => {
      return (
        <li key={item.repository} className="item">
          <img className="item__image" src={item.avatar} />
          <section>
            <h2 className="item__name">{item.name}</h2>
            <div className="item__description">
              {item.description}
            </div>
          </section>
        </li>
      );
    });
    return (
      <div className="container">
        <header>
          <SearchForm handleChange={this.handleChange} />
          <button onClick={this.openModal}>Add a New Library</button>
        </header>
        <SubmitForm handleSubmit={this.handleSubmit}/>
        <ul className="items">
          {listItems}
        </ul>
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
  render () {
    return (
      <form onSubmit={this.handleSubmit}>
        <input
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
      <form onSubmit={this.handleSubmit}>
        <input
          type="url"
          placeholder="Enter a valid GitHub link"
          defaultValue={this.state.repo}
          onChange={this.handleChange}
        />
        <button type="submit">Add It</button>
      </form>
    );
  }
}

SubmitForm.propTypes = {
  handleSubmit: React.PropTypes.func.isRequired,
}

ReactDOM.render(<App />, document.getElementById('app'));
