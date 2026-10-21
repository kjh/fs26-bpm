import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import {
  Box,
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  Chip,
} from '@mui/material'

import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import AddIcon from '@mui/icons-material/Add'
import ListIcon from '@mui/icons-material/List'
import DraggableStack from './DraggableStack'
import DraggableOptionsStack from './DraggableOptionsStack'

const FIELD_CATEGORIES = {
  'Text Content': [
    { value: 'text', label: 'Text' },
    { value: 'predefined', label: 'Predefined Options' },
    { value: 'textarea', label: 'Text Area' },
  ],
  Numeric: [
    { value: 'numeric', label: 'Numeric' },
    { value: 'numeric_unit', label: 'Numeric Unit' },
  ],
  'Date & Time': [
    { value: 'date', label: 'Date' },
    { value: 'date_range', label: 'Date Range' },
    { value: 'time', label: 'Time' },
    { value: 'datetime', label: 'Date & Time' },
  ],
}

const EditProcessFrom = ({ process, updateProcess, reloadProcess }) => {
  const [formData, setFormData] = useState({ ...process })

  const [newFieldPhases, setNewFieldPhases] = useState([])
  const [newFieldOptions, setNewFieldOptions] = useState([])

  const [currentPhaseName, setCurrentPhaseName] = useState('')
  const [currentFieldName, setCurrentFieldName] = useState('')
  const [currentFieldType, setCurrentFieldType] = useState('')
  const [currentOption, setCurrentOption] = useState('')
  const [currentFieldDefinition, setCurrentFieldDefinition] = useState(null)

  const [isOptionsNameValid, setIsOptionsNameValid] = useState(true)
  const [isPhaseNameValid, setIsPhaseNameValid] = useState(true)
  const [isAddPhaseButtonDisabled, setIsAddPhaseButtonDisabled] = useState(true)

  const [isStackChanged, setIsStackChanged] = useState(false)

  useEffect(() => {
    if (process) {
      setFormData({ ...process })
      setIsStackChanged(false)
      setCurrentFieldName('')
    }
  }, [process])

  const navigate = useNavigate()

  if (!process && !formData) return

  console.log('EditProcessFrom')

  // Current field_definition that is clicked to edit
  // Set form data
  const onCurrentFieldDefinitionChange = (index) => {
    const field = formData.field_definitions[index]
    setCurrentFieldName(field.name)
    setCurrentFieldType(field.type)
    setNewFieldPhases(
      field.phases.map((phase) => {
        if (phase?.name) return phase.name

        return phase
      }),
    )
    setNewFieldOptions(field.options)
    setCurrentFieldDefinition(index) // indeksi
  }

  // Phases
  //-----------------------------------------

  // Draggable stack order
  // ok
  const onPhaseOrderChange = (newOrder) => {
    setIsStackChanged(true)
    setFormData((prevData) => {
      return {
        ...prevData,
        phases: newOrder,
      }
    })
  }

  // Add phases text field
  // ok
  const onAddPhaseNameFieldsChange = (event) => {
    const name = event.target.value
    setCurrentPhaseName(name)

    for (const phase of process?.phases) {
      if (phase?.name === name) {
        setIsAddPhaseButtonDisabled(true)
        return
      }
    }

    if (name.trim() === '') {
      setIsAddPhaseButtonDisabled(true)
      return
    }

    setIsAddPhaseButtonDisabled(false)
  }

  // Draggable stack name
  // ok
  const onPhaseNameChange = (i, id, name) => {
    setCurrentPhaseName('')
    setIsStackChanged(true)

    setFormData((prevData) => {
      const updatedPhases = [...prevData.phases]
      const hasSameName = updatedPhases.some(
        (phase) => phase.name?.trim() === name,
      )
      updatedPhases[i] = {
        ...updatedPhases[i],
        name: name,
      }
      const hasEmptyName = updatedPhases.some(
        (phase) => phase.name?.trim() === '',
      )

      if (hasEmptyName || hasSameName) {
        setIsPhaseNameValid(false)
      } else {
        setIsPhaseNameValid(true)
      }
      return {
        ...prevData,
        phases: updatedPhases,
      }
    })
  }

  // Add new phase
  // calls updateProcess
  const handleAddPhase = async (event) => {
    event.preventDefault()

    try {
      const nextFormData = {
        ...formData,
        phases: [...formData.phases, { name: currentPhaseName }],
      }

      const updatedProcess = await updateProcess(nextFormData.id, nextFormData)

      setFormData(updatedProcess)
      setIsStackChanged(false)
      setCurrentPhaseName('')
      setCurrentPhaseName('')

      await reloadProcess() // reload
    } catch (error) {
      console.log('error', error)
    }
  }

  // Field definitions
  //-----------------------------------------

  // Field Options
  //-----------------------------------------

  // Draggable stack reorder
  const onOptionsOrderChange = (newOrder) => {
    console.log('onOptionsOrderChange', newOrder)
    setNewFieldOptions(newOrder)
  }

  // Draggable stack options name
  const onOptionsNameChange = (i, name) => {
    if (name?.length === 0) {
      setIsOptionsNameValid(false)
    } else {
      setIsOptionsNameValid(true)
    }
    setNewFieldOptions((prevOptions) => {
      const updatedOptions = [...prevOptions]

      updatedOptions[i] = name

      return updatedOptions
    })
  }

  // Phases select
  const handlePhaseSelectChange = (event) => {
    event.preventDefault()
    const value = event.target.value

    console.log('phase select change value', value)

    if (value) {
      setNewFieldPhases((prevPhases) => {
        if (!prevPhases.includes(value)) {
          return [...prevPhases, value]
        }
        return prevPhases
      })
    }
    event.target.value = ''
  }

  // add / edit field definition
  // calls update!
  // two paths
  const addNewFieldDefinition = async (event) => {
    event.preventDefault()
    // update
    if (currentFieldDefinition !== null) {
      const updatedFieldDefinitions = [...formData.field_definitions]
      updatedFieldDefinitions[currentFieldDefinition] = {
        ...updatedFieldDefinitions[currentFieldDefinition],
        name: currentFieldName,
        type: currentFieldType,
        phases: newFieldPhases,
        options: newFieldOptions,
      }

      const updatedFormData = {
        ...formData,
        field_definitions: updatedFieldDefinitions,
      }

      setFormData(updatedFormData)

      try {
        await updateProcess(updatedFormData.id, updatedFormData)
        await reloadProcess() // reload
      } catch (error) {
        console.log('error', error)
      }
    } else {
      // add field
      const addedFormData = {
        ...formData,
        field_definitions: [
          ...formData.field_definitions,
          {
            name: currentFieldName,
            type: currentFieldType,
            phases: newFieldPhases,
            options: newFieldOptions,
          },
        ],
      }
      setFormData(addedFormData)

      try {
        await updateProcess(addedFormData.id, addedFormData)
      } catch (error) {
        console.log('error', error)
      }
    }
    setCurrentFieldDefinition(null)
    setCurrentFieldName('')
    setCurrentFieldType('')
    setNewFieldPhases([])
    setNewFieldOptions([])
  }

  // Update and close
  const editProcess = async (event) => {
    event.preventDefault()
    try {
      const updatedProcess = await updateProcess(formData.id, formData)

      // When phase stack is updated
      if (hasUnsavedChanges) {
        setFormData(updatedProcess)
        setIsStackChanged(false)
        return
      }

      if (updatedProcess && updatedProcess.id)
        navigate(`/processes/${updatedProcess.id}`)
    } catch (error) {
      console.log('error', error)
    }
  }

  // add string to predefined options
  const addPredefinedOption = () => {
    setNewFieldOptions(newFieldOptions.concat(currentOption))
    setCurrentOption('')
  }

  const removePredefinedOption = (index) => {
    setNewFieldOptions((prevData) => prevData.filter((_, i) => i !== index))
  }

  //
  // Options: predefined and numeric_unit
  //
  const optionsInput = () => {
    switch (currentFieldType) {
      case 'predefined':
        const isButtonDisabled = !currentOption || !currentOption.trim()

        return (
          <FormControl fullWidth sx={{ maxWidth: 400, mt: 2 }}>
            <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
              <ListIcon fontSize="small" color="action" />
              <Typography
                variant="body2"
                fontWeight="bold"
                color="text.primary"
              >
                Add predefined options
              </Typography>
            </Stack>

            <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
              <TextField
                fullWidth
                size="small"
                id="predefinedOptions"
                label="Predefined option"
                placeholder="Write option value here"
                value={currentOption}
                onChange={(event) => setCurrentOption(event.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isButtonDisabled) {
                    e.preventDefault()
                    addPredefinedOption()
                  }
                }}
              />

              <Button
                type="button"
                variant="contained"
                color="primary"
                disabled={isButtonDisabled}
                startIcon={<AddIcon />}
                onClick={addPredefinedOption}
                sx={{
                  height: 40,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  px: 2.5,
                }}
              >
                Add
              </Button>
            </Stack>

            {newFieldOptions.length > 0 ? (
              <Box sx={{ mt: 1, width: '100%' }}>
                <DraggableOptionsStack
                  stackData={newFieldOptions}
                  onNameChange={onOptionsNameChange}
                  onOrderChange={onOptionsOrderChange}
                  onRemoveOption={removePredefinedOption}
                />
              </Box>
            ) : (
              <Typography variant="h6" fontWeight="bold">
                Edit predefined options{' '}
                <Typography
                  component="span"
                  variant="body2"
                  color="text.disabled"
                  sx={{
                    fontStyle: 'italic',
                    display: 'block',
                    fontWeight: 'normal',
                  }}
                >
                  Empty
                </Typography>
              </Typography>
            )}
          </FormControl>
        )

      case 'numeric_unit':
        return (
          <label>
            Add unit
            <Box style={{ display: 'flex', gap: '8px' }}>
              <input
                id="numericUnit"
                value={newFieldOptions?.[0] || ''}
                onChange={(event) => setNewFieldOptions([event.target.value])}
                placeholder="unit"
              />
            </Box>
          </label>
        )

      default:
        return null
    }
  }
  const isAddFieldButtonDisabled =
    !isOptionsNameValid ||
    currentFieldName.trim() === '' ||
    currentFieldType?.trim() === '' ||
    (newFieldPhases && newFieldPhases.length < 1) ||
    ((currentFieldType?.trim() === 'predefined' ||
      currentFieldType?.trim() === 'numeric_unit') &&
      newFieldOptions?.[0] === undefined) ||
    newFieldOptions?.[0]?.length === 0

  const hasUnsavedChanges = isStackChanged

  const disableAddPhase =
    isAddPhaseButtonDisabled || currentPhaseName?.trim() === ''

  return (
    <Box>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 'bold',
          width: '100%',
          color: '#424242',
        }}
      >
        Edit process
      </Typography>

      <Box
        component="form"
        onSubmit={editProcess}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          maxWidth: 400,
          width: '100%',
          p: 2,
          mb: 4,
        }}
      >
        <Box>
          <TextField
            id="processName"
            label="Process name"
            placeholder="process name"
            value={formData.name || ''}
            onChange={(event) => {
              const newValue = event.target.value
              setFormData((prevData) => ({
                ...prevData,
                name: newValue,
              }))
            }}
            variant="standard"
            fullWidth
            sx={{ mb: 2 }}
          />
        </Box>
        <Box>
          <TextField
            id="phaseName"
            label="Add phases"
            placeholder="phase name"
            value={currentPhaseName}
            onChange={onAddPhaseNameFieldsChange}
            variant="standard"
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button
            type="button"
            variant="contained"
            color="primary"
            onClick={handleAddPhase}
            disabled={disableAddPhase}
            sx={{ fontWeight: 'bold', textTransform: 'none' }}
          >
            Add phase
          </Button>
        </Box>
        <Box>
          <DraggableStack
            key={`stack-${formData.updatedAt}`}
            stackData={formData.phases}
            onNameChange={onPhaseNameChange}
            onOrderChange={onPhaseOrderChange}
          />
        </Box>
        {hasUnsavedChanges && (
          <Box sx={{ p: 1, m: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<SaveIcon />}
              disabled={!isPhaseNameValid}
            >
              Save changes
            </Button>
            <Button
              type="button"
              variant="outlined"
              color="error"
              fullWidth
              sx={{ mt: 1 }}
              onClick={async () => {
                await reloadProcess()
                setFormData({ ...process })
                setIsStackChanged(false)
                setCurrentFieldName('')
              }}
            >
              Cancel
            </Button>
          </Box>
        )}
        {/* section that can be disabled start */}
        <Box
          sx={{
            opacity: hasUnsavedChanges ? 0.4 : 1,
            pointerEvents: hasUnsavedChanges ? 'none' : 'auto',
            transition: 'opacity 0.2s',
          }}
        >
          {/* Field Definitions section */}
          <Stack spacing={2} sx={{ marginTop: 5, maxWidth: 400 }}>
            <Typography variant="h6" fontWeight="bold">
              Process field definitions
              <Typography
                component="span"
                variant="body2"
                color="text.disabled"
                sx={{
                  fontStyle: 'italic',
                  display: 'block',
                  fontWeight: 'normal',
                }}
              >
                Click to edit
              </Typography>
            </Typography>
            {/* field definition stack */}
            <Stack spacing={1.5}>
              {formData.field_definitions.map((item, index) => {
                const isSelected =
                  formData?.field_definitions[currentFieldDefinition]?.name ===
                  item.name
                return (
                  <Paper
                    key={item?.id || index}
                    elevation={1}
                    onClick={() => onCurrentFieldDefinitionChange(index)}
                    sx={{
                      p: 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      cursor: 'pointer',
                      '&:hover': {
                        boxShadow: 5,
                      },
                      backgroundColor: isSelected ? 'action.selected' : '#fff',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <EditIcon color={isSelected ? 'primary' : 'action'} />
                    </div>
                    <Stack spacing={1} alignitems="flex-start">
                      <Stack direction="row" spacing={1}>
                        Name: {item.name} Type: {item.type}
                      </Stack>
                      <Stack
                        direction="row"
                        spacing={1}
                        useFlexGap
                        sx={{ flexWrap: 'wrap' }}
                      >
                        {item.phases.map((phase, index) => (
                          <Chip
                            key={index}
                            label={phase.name || phase}
                            color="primary"
                            variant="outlined"
                          />
                        ))}
                      </Stack>
                    </Stack>
                  </Paper>
                )
              })}
            </Stack>
          </Stack>
          <Box>
            <Box sx={{ m: 1 }}>
              {currentFieldDefinition === null ? (
                <Typography variant="h6" fontWeight="bold">
                  New field definition
                  {formData.field_definitions[currentFieldDefinition]?.name}
                </Typography>
              ) : (
                <Box>
                  <Typography variant="h6" fontWeight="bold">
                    Editing field:{' '}
                    {formData.field_definitions[currentFieldDefinition]?.name}
                  </Typography>
                </Box>
              )}
            </Box>
            <Box sx={{ m: 1 }}>
              <TextField
                id="fieldName"
                label="Field name"
                placeholder="field name"
                value={currentFieldName}
                onChange={(event) => setCurrentFieldName(event.target.value)}
                fullWidth
                variant="standard"
                sx={{ mb: 2 }}
              />
              <Box>
                {currentFieldDefinition !== null ? (
                  <Typography variant="h7" fontWeight="bold">
                    Field type: {currentFieldType}
                  </Typography>
                ) : (
                  <FormControl
                    fullWidth
                    variant="outlined"
                    sx={{ maxWidth: 400 }}
                  >
                    <InputLabel id="fieldType-label">Field type</InputLabel>
                    <Select
                      labelId="fieldType-label"
                      id="fieldType"
                      value={currentFieldType}
                      label="Field type"
                      onChange={(event) => {
                        setNewFieldOptions([])
                        setCurrentFieldType(event.target.value)
                      }}
                    >
                      <MenuItem value="" disabled>
                        <em>-- Select field type --</em>
                      </MenuItem>
                      {Object.entries(FIELD_CATEGORIES).map(
                        ([category, options]) => [
                          <ListSubheader
                            key={category}
                            sx={{
                              fontWeight: 'bold',
                              color: 'primary.main',
                              lineHeight: '36px',
                              backgroundColor: '#f5f5f5',
                            }}
                          >
                            {category}
                          </ListSubheader>,
                          options.map((opt) => (
                            <MenuItem
                              key={opt.value}
                              value={opt.value}
                              sx={{ pl: 4 }}
                            >
                              {opt.label}
                            </MenuItem>
                          )),
                        ],
                      )}
                    </Select>
                  </FormControl>
                )}
              </Box>
              {optionsInput()}
              <Box>
                <FormControl
                  fullWidth
                  variant="outlined"
                  sx={{ maxWidth: 400, mt: 2 }}
                >
                  <InputLabel id="fieldPhases-label">Field phases</InputLabel>

                  <Select
                    labelId="fieldPhases-label"
                    id="fieldPhases"
                    value=""
                    label="Field phases"
                    onChange={handlePhaseSelectChange}
                  >
                    <MenuItem value="" disabled>
                      <em>-- Select phase to add --</em>
                    </MenuItem>
                    {formData.phases
                      .filter(
                        (phase) =>
                          !newFieldPhases.some(
                            (fieldPhase) => fieldPhase === phase.name,
                          ),
                      )
                      .map((phase, index) => (
                        <MenuItem
                          key={phase.id || phase._id || index}
                          value={phase.name}
                        >
                          {phase.name}
                        </MenuItem>
                      ))}

                    {formData.phases.filter(
                      (phase) =>
                        !newFieldPhases.some(
                          (fieldPhase) => fieldPhase === phase.name,
                        ),
                    ).length === 0 && (
                      <MenuItem value="" disabled sx={{ fontStyle: 'italic' }}>
                        All phases already added
                      </MenuItem>
                    )}
                  </Select>
                </FormControl>
              </Box>

              <Box>
                {newFieldPhases.length > 0 ? (
                  <Stack spacing={1} alignitems="flex-start">
                    <Typography
                      variant="subtitle2"
                      color="text.secondary"
                      fontWeight="medium"
                    >
                      Active phases
                    </Typography>
                    <Stack
                      direction="row"
                      spacing={1}
                      useFlexGap
                      sx={{ flexWrap: 'wrap' }}
                    >
                      {newFieldPhases.map((phase, index) => (
                        <Chip
                          key={index}
                          label={phase.name || phase}
                          color="primary"
                          variant="outlined"
                          onDelete={() => {
                            const updatedFieldPhases = newFieldPhases.filter(
                              (_, i) => i !== index,
                            )
                            setNewFieldPhases(updatedFieldPhases)
                          }}
                        />
                      ))}
                    </Stack>
                  </Stack>
                ) : (
                  <Typography
                    component="span"
                    variant="body2"
                    color="text.disabled"
                    sx={{
                      fontStyle: 'italic',
                      display: 'block',
                      fontWeight: 'normal',
                    }}
                  >
                    No selected phases
                  </Typography>
                )}
              </Box>
            </Box>
            <Box>
              {currentFieldDefinition === null ? (
                <Button
                  type="button"
                  variant="contained"
                  color="primary"
                  startIcon={<AddIcon />}
                  onClick={addNewFieldDefinition}
                  fullWidth
                  sx={{
                    fontWeight: 'bold',
                    textTransform: 'none',
                    borderRadius: 1.5,
                  }}
                  disabled={isAddFieldButtonDisabled}
                >
                  Add field
                </Button>
              ) : (
                <Box>
                  <Button
                    onClick={addNewFieldDefinition}
                    type="button"
                    variant="contained"
                    color="primary"
                    startIcon={<SaveIcon />}
                    sx={{ m: 1 }}
                    disabled={isAddFieldButtonDisabled}
                  >
                    Save changes (addNewFieldDefinition)
                  </Button>
                  <Button
                    type="button"
                    variant="outlined"
                    color="error"
                    sx={{ m: 1 }}
                    onClick={() => {
                      setCurrentFieldDefinition(null)
                      setCurrentFieldName('')
                      setCurrentFieldType('')
                      setNewFieldOptions([])
                      setNewFieldPhases([])
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              )}
            </Box>
          </Box>
        </Box>{' '}
        {/* section (that can be disabled) end */}
        {!hasUnsavedChanges && (
          <Box sx={{ p: 1, m: 2 }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              startIcon={<SaveIcon />}
            >
              Save and close process
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default EditProcessFrom
