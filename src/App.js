import React from 'react';
import {Editor} from '@tinymce/tinymce-react';
import './App.css'

import tinymce from 'tinymce/tinymce';
import "tinymce/themes/silver/index";
import "tinymce/plugins/image";
import "tinymce/plugins/lists";
import "tinymce/plugins/paste";
import "tinymce/plugins/table";
import "tinymce/plugins/imagetools";
import "tinymce/plugins/codesample";
import "tinymce/plugins/advlist";
import "tinymce/plugins/wordcount";
import "tinymce/plugins/textpattern";
import "tinymce/plugins/tabfocus";
import "tinymce/plugins/link";
import "tinymce/themes/mobile"


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            titleValue: '',
            contentValue: ''
        }
        this.getEditor = this.getEditor.bind(this)
        this.handleInputChange = this.handleInputChange.bind(this)
    }

    handleEditorChange = (content) => {
        this.setState({
            contentValue: content
        })
    }

    handleInputChange(event) {
        this.setState({
            titleValue: event.target.value
        })
    }


    getEditor() {
        const {titleValue, contentValue} = this.state
        let jsonStr = `{"title": "${titleValue}","content": "${contentValue}"}`
        return JSON.parse(jsonStr)
    }


    componentDidMount() {
        window.getEditor = this.getEditor
        this.setState({
            titleValue: window.android.getStatusTitle()
        })
    }

    uploadHandler = (blobInfo, success, failure) => {
        const xhr = new XMLHttpRequest();
        const token = window.android.getToken()
        xhr.withCredentials = false;

        xhr.open("POST", "http://work.muxi-tech.xyz/api/v1.0/editor/image/");
        xhr.setRequestHeader("token", token);

        xhr.onload = () => {
            if (xhr.status !== 200) {
                failure(`HTTP Error: ${xhr.status}`);
                return;
            }
            const json = JSON.parse(xhr.responseText);

            if (!json || typeof json.image_url !== "string") {
                failure(`Invalid JSON: ${xhr.responseText}`);
                return;
            }

            success(json.image_url);
        };

        const formData = new FormData();
        formData.append("image", blobInfo.blob());
        xhr.send(formData);
    };


    render() {
        const editHeight = (document.documentElement.clientHeight || document.body.clientHeight) - 75
        const initContent = window.android.getEdits()
        const {titleValue} = this.state
        return (
            <div>
                <input
                    placeholder="请输入标题"
                    value={titleValue}
                    onChange={this.handleInputChange}
                    style={{
                        width: "100%",
                        height: '61px',
                        fontSize: '20px'
                    }}
                />
                <div className="editor">
                    <Editor
                        initialValue={initContent}
                        init={{
                            mobile: {
                                height: editHeight,
                                skin: 'oxide',
                                language: "zh_CN",
                                language_url: "http://static.muxixyz.com/workbench/lang/zh_CN.js",
                                powerpaste_allow_local_images: true,
                                images_upload_handler: this.uploadHandler,
                                paste_data_images: true,
                                skin_url: "http://static.muxixyz.com/workbench/skins/ui/oxide",
                                textpattern_patterns: [
                                    {start: "*", end: "*", format: "italic"},
                                    {start: "**", end: "**", format: "bold"},
                                    {
                                        start: "~",
                                        end: "~",
                                        cmd: "createLink",
                                        value: "http://work.muxi-tech.xyz"
                                    },
                                    {start: "#", format: "h1"},
                                    {start: "##", format: "h2"},
                                    {start: "###", format: "h3"},
                                    {start: "####", format: "h4"},
                                    {start: "#####", format: "h5"},
                                    {start: "######", format: "h6"},
                                    {start: "* ", cmd: "InsertUnorderedList"},
                                    {start: "- ", cmd: "InsertUnorderedList"},
                                    {start: "+ ", cmd: "InsertUnorderedList"},
                                    {
                                        start: "1. ",
                                        cmd: "InsertOrderedList",
                                        value: {"list-style-type": "decimal"}
                                    },
                                    {
                                        start: "1) ",
                                        cmd: "InsertOrderedList",
                                        value: {"list-style-type": "decimal"}
                                    },
                                    {
                                        start: "a. ",
                                        cmd: "InsertOrderedList",
                                        value: {"list-style-type": "lower-alpha"}
                                    },
                                    {
                                        start: "a) ",
                                        cmd: "InsertOrderedList",
                                        value: {"list-style-type": "lower-alpha"}
                                    },
                                    {
                                        start: "i. ",
                                        cmd: "InsertOrderedList",
                                        value: {"list-style-type": "lower-roman"}
                                    },
                                    {
                                        start: "i) ",
                                        cmd: "InsertOrderedList",
                                        value: {"list-style-type": "lower-roman"}
                                    },
                                    {start: "---", replacement: "<hr/>"},
                                    {start: "--", replacement: "—"},
                                    {start: "-", replacement: "—"},
                                    {start: "(c)", replacement: "©"},
                                    {start: "//brb", replacement: "Be Right Back"},
                                    {
                                        start: "//heading",
                                        replacement:
                                            '<h1 style="color: blue">Heading here</h1> <h2>Author: Name here</h2> <p><em>Date: 01/01/2000</em></p> <hr />'
                                    }
                                ],
                                plugins:
                                    "tabfocus textpattern image paste link lists table imagetools codesample advlist wordcount",
                                toolbar:
                                    "undo redo| bullist numlist | image | link | codesample |bold italic formatselect | forecolor backcolor | alignleft aligncenter alignright  alignjustify | wordcount",
                                toolbar_location: 'bottom',
                                toolbar_mode: 'sliding',
                            },
                            skin_url: "http://static.muxixyz.com/workbench/skins/ui/oxide",
                        }}
                        onEditorChange={this.handleEditorChange}
                    />
                </div>
            </div>
        );
    }
}

export default App;
