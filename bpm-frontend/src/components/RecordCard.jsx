const RecordCard = ({ record }) => {
  const cardStyle = {
    backgroundColor: '#fff',
    border: '1px solid #000',
    borderRadius: '16px',
    padding: '20px',
    maxWidth: '350px',
    marginBottom: '15px',
  }

  const titleStyle = {
    margin: '0 0 16px 0',
    fontSize: '1.25rem',
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

  return (
    <div style={cardStyle}>
      <h3 style={titleStyle}>{record.title}</h3>
      <div>
        {record.fields?.map((field, i) => (
          <div key={i} style={fieldGroupStyle}>
            <span style={labelStyle}>{field.field_definition?.name}</span>
            <span style={valueStyle}>
              {String(field.value)}{' '}
              {field.field_definition?.options &&
                field.field_definition.options[0]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default RecordCard
