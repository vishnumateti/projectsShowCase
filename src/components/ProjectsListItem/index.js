const ProjectsListItem = props => {
  const {projectDetails} = props
  const {name, imageUrl} = projectDetails

  return (
    <li>
      <img src={imageUrl} alt={name} />
      <p>{name}</p>
    </li>
  )
}

export default ProjectsListItem
