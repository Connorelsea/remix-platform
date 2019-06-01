import React, { Component, type Node } from "react";
import { connect } from "react-redux";
import styled, { withTheme } from "styled-components";
import Modal from "react-responsive-modal";
import ReactCrop from "react-image-crop";
import { bind } from "decko";
import gql from "graphql-tag";

import Spacing from "../Spacing";

import Title from "../../elements/Title";
import Button from "../../elements/Button";
import Box from "../../elements/Box";

import AzureStorage from "../../utilities/azure-storage.blob.js";
import { mutate } from "../../utilities/gql_util";

type Props = {
  show: boolean,
  onClose: any => any,
};

class NewIconModal extends Component<Props> {
  state = {
    crop: {
      aspect: 1,
      width: 50,
      x: 0,
      y: 0,
    },
    image: undefined,
    cropBlob: undefined,
  };

  constructor(props) {
    super(props);

    this.fileInput = React.createRef();
    this.fileButton = React.createRef();
  }

  /**
   * @param {File} image - Image File Object
   * @param {Object} pixelCrop - pixelCrop Object provided by react-image-crop
   * @param {String} fileName - Name of the returned file in Promise
   */
  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");

    console.log("CROP STATS", pixelCrop);
    console.log("DRAW CROPPED IMAGE", image);

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    // As Base64 string
    // const base64Image = canvas.toDataURL('image/jpeg');

    // As a blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(file => {
        file.name = fileName;
        resolve(file);
      }, "image/jpeg");
    });
  }

  onSelectFile = e => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener(
        "load",
        () => {
          console.log("LOAD IMG SRC", reader.result);
          this.setState({
            src: reader.result,
          });
        },
        false
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  onImageLoaded = image => {
    console.log("ON IMAGE LOAD", image);
    this.setState({ image });
  };

  @bind
  async onCropComplete(crop, pixelCrop) {
    console.log("onCropComplete", crop);
    const { image } = this.state;

    const croppedImg = await this.getCroppedImg(
      image,
      pixelCrop,
      "profilepic.jpeg"
    );
    console.log("CROPPED IMAGE", croppedImg);

    this.setState({ cropBlob: croppedImg });
  }

  onCropChange = crop => {
    this.setState({ crop });
  };

  @bind
  async onSave() {
    const { cropBlob } = this.state;
    const { apolloClient, currentUserId } = this.props;

    console.log("ON SAVE");
    console.log("CROP BLOB", cropBlob);

    const src = gql`
      mutation uploadAvatar($file: Upload!) {
        uploadAvatar(file: $file) {
          filename
        }
      }
    `;

    const response = await mutate(src, { file: cropBlob }, apolloClient);
    
    console.log("RESPONSE", response);

    // var arrayBuffer;
    // var fileReader = new FileReader();
    // fileReader.onload = async event => {
    //   arrayBuffer = event.target.result;

    //   console.log("ARRAY BUFFER", arrayBuffer);

    //   const response = await mutate(
    //     src,
    //     {
    //       file: arrayBuffer,
    //     },
    //     apolloClient
    //   );

    //   console.log("CREATE STORAGE RESPONSE", response);
    // };
    // fileReader.readAsArrayBuffer(cropBlob);
  }

  render(): Node {
    const { show, onClose } = this.props;

    return (
      <Modal center open={show} onClose={onClose}>
        <Title type="BOLD" size="MEDIUM">
          Upload an Image
        </Title>
        <Spacing size={10} />
        <FileInput
          type="file"
          id="image-upload"
          accept="image/x-png,image/gif,image/jpeg"
          onChange={this.onSelectFile}
          innerRef={this.fileInput}
        />
        <Spacing size={10} />

        {this.state.src && (
          <ReactCrop
            src={this.state.src}
            crop={this.state.crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}

        <Spacing size={15} />
        <Box fullWidth justifyEnd>
          <Button
            size="MEDIUM"
            type="EMPHASIS"
            title="Save Image"
            onClick={this.onSave}
          />
        </Box>
      </Modal>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    currentUserId: state.identity.currentUserId,
    apolloClient: state.auth.apolloClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(NewIconModal);

const FileInput = styled.input`
  color: transparent;

  &::before {
    content: "Select a file";
    display: inline-block;
    background: -webkit-linear-gradient(top, #f9f9f9, #e3e3e3);
    border: 1px solid #999;
    border-radius: 3px;
    padding: 5px 8px;
    outline: none;
    white-space: nowrap;
    -webkit-user-select: none;
    cursor: pointer;
    text-shadow: 1px 1px #fff;
    font-weight: 700;
    font-size: 10pt;
    color: ${p => p.theme.text.primary};
  }

  &::-webkit-file-upload-button {
    visibility: hidden;
  }
`;
