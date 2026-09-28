import EditableTextField from './EditableTextField'
import EditableTextArea from './EditableTextarea'

const RecordCard = ({ record }) => {
  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #000',
    borderRadius: '16px',
    padding: '16px',
    maxWidth: '350px',
    marginBottom: '15px',
  }

  const titleStyle = {
    margin: '0 0 8px 0',
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#000',
  }

  const fieldGroupStyle = {
    display: 'flex',
    flexDirection: 'column', // nimi ja arvo allekkain
    gap: '4px',
    marginBottom: '12px',
  }

  const labelStyle = {
    fontSize: '0.85rem',
    color: '#000',
    fontWeight: 'bold',
  }

  const valueStyle = {
    fontSize: '1rem',
    color: '#000',
    backgroundColor: '#fff',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid green',
  }

  console.log(record)

  const renderValue = (field) => {
    const type = field.field_definition?.type
    const value = field.value

    switch (type) {
      case 'numeric':
      case 'numeric_unit':
        return <EditableTextField field={field} inputType={'numeric'} />

      case 'date':
        return <EditableTextField field={field} inputType={'date'} />

      case 'datetime':
        return <EditableTextField field={field} inputType={'datetime-local'} />

      case 'time':
        return <EditableTextField field={field} inputType={'time'} />

      case 'textarea':
        return <EditableTextArea valueStyle={valueStyle} field={field} />

      default:
        return <EditableTextField field={field} inputType={'text'} />
    }
  }

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{record.title}</h3>

      <div>
        <span style={labelStyle}>Phase: {record.current_phase?.name}</span>
        {record.fields?.map((field, i) => (
          <div key={i} style={fieldGroupStyle}>
            <span style={labelStyle}>{field.field_definition?.name}</span>
            {renderValue(field)}
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecordCard
