const Header = ({ course }) => {
  return(<h1>{course}</h1>)
}

const Content = ({ parts }) => {
  return(
    <>
      {parts.map((part, index) => (
        <Part key={index} part={part.name} exercises={part.exercises} />
      ))}
    </>
  )
}

const Part = ({ part, exercises }) => {
  return(
    <p>{part} {exercises}</p>
  )
}

const Total = ({ parts }) => {
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)
  return(
    <p><b>total of {total} exercises</b></p>
  )
}

const Course = ({course} ) => {
  return (
    <div>
      {course.map((c) => (
        <div key={c.id}>
          <Header course={c.name} />
          <Content parts={c.parts} />
          <Total parts={c.parts} />
        </div>
      ))}
    </div>
  )
}

export default Course