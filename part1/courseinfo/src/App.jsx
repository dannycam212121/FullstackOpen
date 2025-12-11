const Header = ({ course }) => {
  return(<h1>{course}</h1>)
}

const Content = ({ parts }) => {
  return(
    <>
      {parts.map((part, index) => (
        <Part key={index} part={part.part} exercises={part.exercises} />
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
    <p>Number of exercises {total}</p>
  )
}



const App = () => {
  const course = 'Half Stack application development'
  const parts = [
    {
      part: 'Fundamentals of React',
      exercises: 10
    },
    {
      part: 'Using props to pass data',
      exercises: 7
    },
    {
      part: 'State of a component',
      exercises: 14
    }
  ]

  return (
    <div>
      <Header course={course} />
      <Content parts={parts} />
      <Total parts={parts} />
    </div>
  )
}

export default App