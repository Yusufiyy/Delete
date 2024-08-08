import { PlusOutlined } from '@ant-design/icons'
import { Button, Form, Input, message, Modal, Table, Upload } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { NavLink } from 'react-router-dom'

const Home = () => {
  const [cities, setCities] = useState([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [currentcity, setCurrentcity] = useState(null)
  const mytoken = localStorage.getItem('token')
  const [form] = Form.useForm()
  const navigate = useNavigate()
  const getCities = () =>{
    axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/cities')
    .then(res=>setCities(res?.data?.data))
    .catch(err=>console.log(err))
  } 
  useEffect(()=>{
    if(! mytoken){
      navigate('/')
    }
    getCities()
  },[])
  const showModal = (item) =>{    
    form.setFieldsValue({
      name: item.name,
      text: item.text,
      images: [{name:'images', url:`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item.image_src}`} ]
    })
    setOpen(true)
    setCurrentcity(item)
  }
  const closeModal = () =>{
    setOpen(false)
    form.resetFields()
  }
  const columns = [
    {
      title: 'Name',
      dataIndex: 'name'
    },
    {
      title: 'Text',
      dataIndex: 'text'
    },
    {
      title: 'Images',
      dataIndex: 'images'
    },
    {
      title: 'Action',
      dataIndex: 'button'
    }
  ]
  const ysf = cities.map((item,index)=>(
    {
      key: index,
      name: item.name,
      text: item.text,
      images: (<img width={200} src={`https://autoapi.dezinfeksiyatashkent.uz/api/uploads/images/${item.image_src}`}/> ),
      button: (<><Button type='primary' onClick={()=>showModal(item)}>Edit</Button> <Button type='primary' danger onClick={()=>deleteCities(item.id)}>Delete</Button></>)
    }
  ))
  
  const createPost = (values) => {
    setLoading(true)
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('text', values.text);
    
    if (values.images && values.images.length > 0) {
      values.images.forEach((image) => {
        if (image && image.originFileObj) {
          formData.append('images', image.originFileObj, image.name)
        }
      })
    }
  
  axios({
    url: currentcity?`https://autoapi.dezinfeksiyatashkent.uz/api/cities/${currentcity.id}`:`https://autoapi.dezinfeksiyatashkent.uz/api/cities`,
    method:currentcity?'PUT':'POST',
    headers:{
      Authorization: `Bearer ${mytoken}`
    },
    data:formData
  })
  .then(res=>{
    if(res?.data.success){
      currentcity?message.success("O'zgartirildi"):message.success("Qo'shildi ")
      setOpen(false)
      getCities()
      form.resetFields()
    }
  })
  .catch(err=>console.log(err))
  .finally(()=>{
    setLoading(false)
  })
} 

const deleteCities = (id) =>{
  axios({
    url: `https://autoapi.dezinfeksiyatashkent.uz/api/cities/${id}`,
    method: 'DELETE',
    headers:{
      Authorization: `Bearer ${mytoken}`
    }
  })
  .then((res)=>{
    message.success("post o'chirildi")
    const updateCities = cities.filter(item => item.id !== id)
    setCities(updateCities)
  })
  .catch(err=>{
    message.error("xatolik mavjud")
  })
}
const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  return isJpgOrPng;
};
const normFile = (e) => {
  if (Array.isArray(e)) {
      return e;
  }
  return e && e.fileList;
}
  return (
    <div>
      <Button type='primary' onClick={()=>setOpen(true)}>Add</Button>
      <NavLink to="/models">Models</NavLink>
      <Table columns={columns} dataSource={ysf}/>
      <Modal open={open} onCancel={closeModal} footer={null} >
        <Form  form={form} onFinish={createPost}>
          <Form.Item label='Name' name='name'>
            <Input placeholder='Name' style={{width: '90%'}}/>
          </Form.Item>
          <Form.Item label='Text' name='text'>
            <Input placeholder='Text' style={{width: '90%'}}/>
          </Form.Item>
          <Form.Item label="Upload Image" name="images" valuePropName="fileList" getValueFromEvent={normFile} rules={[{ required: true, message: 'Please upload an image' }]}>
            <Upload
              customRequest={({ onSuccess }) => { onSuccess("ok"); }}
              beforeUpload={beforeUpload}
              listType="picture-card"
              > 
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Upload</div>
              </div>
            </Upload>
          </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>Submit</Button>
        </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Home
