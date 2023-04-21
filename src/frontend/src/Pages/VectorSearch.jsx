import axios from "axios"
import { useEffect, useState } from "react"
import { Text, Button, Input, Dropdown } from '@fluentui/react-northstar';
import { JSONTree } from "react-json-tree";

export default function ViewInsights(props) {

    const [documents, setDocuments] = useState([])
    const [oaiAnswer, setOiaAnswer] = useState(null)
    const [query, setQuery] = useState("")
    const [pipelineNames, setPipelineNames] = useState([])
    const [selectedPipelineName, setSelectedPipelineName] = useState("")


    useEffect(() => {
        axios.get(`/api/config?id=pipelines`).then(value => {
            if (value?.data?.pipelines) {
                const names = []
                for (const p of value.data.pipelines) {
                    names.push(p.name)
                }
                setPipelineNames(names)
            } else {
                setPipelineNames([])
            }
        })

    }, [])

    const onDropDownChange = (event, selected) => {
        setSelectedPipelineName(selected.value)
    }

    const onQueryChange = (_, value) => {
        setQuery(value.value)
    }

    const onSearch = () => {
        axios.get(`/api/vectorSearch?query=${query}&pipeline=${selectedPipelineName}`).then(r => {
            setDocuments(r.data.documents)
            setOiaAnswer(r.data.oaiAnswer)
        })
    }

    const renderAnswer = () => {
        if (oaiAnswer) {
            return (
                <div className="card answer">
                    <div className="card-body" style={{ textAlign: 'left' }}>
                        <div style={{ fontWeight: 'bold' }}>
                            Answer:
                        </div>
                        {oaiAnswer.choices[0].text}
                    </div>
                </div>
            )
        }
    }

    const renderDocuments = () => {
        if (documents) {
            return documents.map((d) => {
                return (
                    <div className="card result" id={d.document.id}>

                        {/* <img className="card-img-top" src={pdf} alt={pdf}></img> */}
                        <div className="card-body">
                            <h6 className="title-style">{d.document.filename}</h6>
                            <div style={{ textAlign: "left" }}>
                                {(d?.document?.aggregatedResults?.ocrToText) ? d.document.aggregatedResults.ocrToText : ""}
                                {(d?.document?.aggregatedResults?.ocr?.content) ? d.document.aggregatedResults.ocr.content : ""}
                                {(d?.document?.aggregatedResults?.speechToText) ? d.document.aggregatedResults.speechToText : ""}
                            </div>
                            {/* <div style={{ textAlign: "left" }}>
                                {renderPills()}
                        </div> */}
                            <div className="json-tree">
                                <JSONTree data={d.document} theme={theme} shouldExpandNode={() => false} />
                            </div>
                        </div>
                    </div>
                )
            })
        }
    }

    const theme = {
        base00: 'black',
        base01: 'black',
        base02: 'black',
        base03: 'black',
        base04: 'black',
        base05: 'black',
        base06: 'black',
        base07: 'black',
        base08: 'black',
        base09: 'black',
        base0A: 'black',
        base0B: 'black',
        base0C: 'black',
        base0D: 'black',
        base0E: 'black',
        base0F: 'black'
    };


    const style = { display: "flex", flexFlow: "column", fontWeight: "500", margin: "20px" }
    return (
        <>

            <div style={{ marginTop: "50px", marginBottom: "50px", display: "flex", flexFlow: "row", flexWrap: "wrap" }}>
                <div style={style}>
                    <Text weight="semibold" content="Select Pipeline to Test" style={{ fontSize: "15px", display: "block", width: "100%", marginBottom: "20px" }} />
                    <Dropdown
                        search
                        placeholder="Select the Pipeline"
                        label="Output"
                        items={pipelineNames}
                        onChange={onDropDownChange}
                        style={{ paddingBottom: "40px" }}
                    />
                    <Text content="Query:" style={{ marginBottom: "10px" }} />
                    <Input value={query} onChange={onQueryChange} fluid style={{ width: "300px", marginBottom: "10px" }} />
                    <Button primary style={{ width: "100px", marginBottom: "10px" }} onClick={onSearch}>Search</Button>
                    {renderAnswer()}
                    {renderDocuments()}
                </div>
            </div>
        </>
    )

}
