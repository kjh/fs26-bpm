import DynamicForm from './DynamicForm'
import KanbanBoard from './KanbanBoard'

const ProcessRecords = ({
  process,
  deleteProcess,
  records,
  addRecord,
  updateRecord,
}) => {
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
      <KanbanBoard
        process={process}
        deleteProcess={deleteProcess}
        addRecord={addRecord}
        updateRecord={updateRecord}
      />
    </div>
  )
}

export default ProcessRecords
