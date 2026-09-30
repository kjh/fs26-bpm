import DynamicForm from './DynamicForm'

const ProcessRecords = ({ addRecord, process }) => {
  if (!process) {
    console.log('no process', process)
    return null
  }

  return (
    <div>
      <h1>{process.name} Records</h1>
      <DynamicForm
        phases={process.phases}
        addRecord={addRecord}
        process_id={process.id}
        phase_id={process.phases[0].id}
        fields={process.field_definitions}
      />
    </div>
  )
}

export default ProcessRecords
