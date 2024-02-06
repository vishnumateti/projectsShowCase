import {Component} from 'react'
import Loader from 'react-loader-spinner'
import ProjectsListItem from './components/ProjectsListItem'
import './App.css'

//  This is the list (static data) used in the application. You can move it to any component if needed.

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

//   Replace your code here

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'Failure',
  loading: 'IN_PROGRESS',
}

class App extends Component {
  state = {
    category: categoriesList[0].id,
    projectsList: [],
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.getProjectsApiUrl()
  }

  getProjectsApiUrl = async () => {
    const {category} = this.state
    this.setState({apiStatus: apiStatusConstants.loading})
    const url = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok) {
      const formattedData = data.projects.map(eachProject => ({
        id: eachProject.id,
        name: eachProject.name,
        imageUrl: eachProject.image_url,
      }))
      this.setState({
        apiStatus: apiStatusConstants.success,
        projectsList: formattedData,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessData = () => {
    const {projectsList} = this.state

    return (
      <ul>
        {projectsList.map(each => (
          <ProjectsListItem key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  retryPage = () => {
    this.getProjectsApiUrl()
  }

  renderFailureData = () => (
    <div>
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
      />
      <h1>Oops! Something Went Wrong</h1>
      <p>We cannot seem to find the page you are looking for.</p>
      <button type="button" onClick={this.retryPage}>
        Retry
      </button>
    </div>
  )

  renderLoading = () => (
    <div data-testid="loader">
      <Loader type="TailSpin" color="#00BFFF" height={50} width={50} />
    </div>
  )

  changeCategory = event => {
    this.setState({category: event.target.value}, this.getProjectsApiUrl)
  }

  renderPage = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessData()
      case apiStatusConstants.failure:
        return this.renderFailureData()
      case apiStatusConstants.loading:
        return this.renderLoading()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state

    return (
      <div>
        <nav>
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
          />
        </nav>
        <select onChange={this.changeCategory} value={category}>
          {categoriesList.map(each => (
            <option value={each.id} key={each.id}>
              {each.displayText}
            </option>
          ))}
        </select>
        <div>{this.renderPage()}</div>
      </div>
    )
  }
}

export default App
