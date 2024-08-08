import { message } from 'antd'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

const Models = () => {
    const [models, setModels] = useState([])
    const [brands, setBrands] = useState([])
    const [name, setName] = useState('')
    const [brandId, setBrandId] = useState('')
    const mytoken = localStorage.getItem('token')

    const getModels = () => {
        axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/models')
        .then(res=>setModels(res?.data?.data))
        .catch(err=>console.log(err))
    }
    const getBrands = () => {
        axios.get('https://autoapi.dezinfeksiyatashkent.uz/api/brands')
        .then(res=>setBrands(res?.data?.data))
        .catch(err=>console.log(err))
    }
    useEffect(()=>{
        getModels()
        getBrands()
    },[])

    const addModels = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('name',name)
        formData.append('brand_id',brandId)
        axios({
            url:'https://autoapi.dezinfeksiyatashkent.uz/api/models',
            method: 'POST',
            headers:{
                Authorization: `Bearer ${mytoken}`
            },
            data: formData 
        })
        .then(res=>{
            if(res?.data.success){
                message.success("Qo'shildi")
                getModels()
            }
        })
        .catch(err=>{
            message.error("Xatolik mavjud")
        })
    } 
  return (
    <div>
        <input type="text" onChange={(e) => setName(e.target.value)}/>
        <select onChange={(e) => setBrandId(e.target.value)} defaultValue={1}>
            <option value="1" disabled style={{display:"none"}}>select</option>
            {
                brands && brands.map((brand,index)=>(
                    <option key={index} value={brand.id}>{brand.title}</option>
                ))
            }
        </select>
        <button onClick={addModels}>Add</button>
        <table>
            <thead>
            <tr>
                <th>Model</th>
                <th>Brand</th>
            </tr>
            </thead>
            <tbody>
            {
                models && models.map((item,index)=>(
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.brand_title}</td>
                    </tr>
                ))
            }
            </tbody>
        </table>
    </div>
  )
}

export default Models