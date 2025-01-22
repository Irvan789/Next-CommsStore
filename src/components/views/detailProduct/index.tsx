/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-empty-object-type */
import { Product } from '@/types/product.type'
import styles from './detailProduct.module.scss'
import Image from 'next/image'
import convertIDR from '@/utils/currency'
import Button from '@/components/ui/Button'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { Dispatch, SetStateAction, useState } from 'react'
import userServices from '@/services/user'

type PropTypes = {
    product: Product | any
    cart: any
    productId: string | string[] | undefined
    setToaster: Dispatch<SetStateAction<{}>>
}

const DetailProductView = (props: PropTypes) => {
    const { product, cart, productId, setToaster } = props
    const { status, data:session }:any = useSession()
    const router = useRouter()
    const [selectedType, setSelectedType] = useState('')
    console.log(product)
    const handleAddToCart = async () => {
        if (selectedType !== '') {
            let newCart = []
            if (cart.filter((item: any) => item.id === productId && item.type === selectedType).length > 0) {
                newCart = cart.map((item: any) => {
                    if (item.id === productId && item.type === selectedType) {
                        item.qty += 1
                    }
                    return item
                })
            } else {
                newCart = [
                    ...cart, 
                    {
                    id: productId,
                    type: selectedType,
                    qty: 1,
                    }
                ]
            }
            try {
                const result = await userServices.addToCart({
                    carts: newCart
                }, session?.accessToken)
                if (result.status === 200) {
                    setSelectedType('')
                    setToaster({
                        variant: 'success',
                        message: 'Product Added to Cart',
                    })
                }
            } catch (error) {
                console.log(error)
                setToaster({
                    variant: 'danger',
                    message: 'Failed to Add to Cart',
                })
            }
            console.log(newCart)
        }
    }
    console.log(status)
    return (
        <div className={styles.detail}>
            <div className={styles.detail__main}>
                <div className={styles.detail__main__left}>
                    <Image
                        className={styles.detail__main__left__image}
                        src={product?.image}
                        width={500}
                        height={500}
                        alt={product?.name}
                    />
                </div>
                <div className={styles.detail__main__right}>
                    <h1 className={styles.detail__main__right__title}>{product?.name}</h1>
                    <p className={styles.detail__main__right__category}>{product?.category}</p>
                    <p className={styles.detail__main__right__price}>
                        {convertIDR(product?.price)}
                    </p>
                    <p className={styles.detail__main__right__description}>
                        {product?.description ? product.description : 'no description provided'}
                    </p>
                    <p className={styles.detail__main__right__subtitle}>Variant</p>
                    <div className={styles.detail__main__right__type}>
                        {product?.stock?.map((item: { type: string; qty: number }) => (
                            <div className={styles.detail__main__right__type__item} key={item.type}>
                                <input
                                    className={styles.detail__main__right__type__item__input}
                                    type='radio'
                                    id={`type-${item.type}`}
                                    name='type'
                                    disabled={item.qty === 0}
                                    onClick={() => setSelectedType(item.type)}
                                    checked={selectedType === item.type}
                                ></input>
                                <label
                                    className={styles.detail__main__right__type__item__label}
                                    htmlFor={`type-${item.type}`}
                                >
                                    {item.type}
                                </label>
                            </div>
                        ))}
                    </div>
                    <Button
                        className={styles.detail__main__right__add}
                        type={status === 'authenticated' ? 'submit' : 'button'}
                        onClick={() => {
                            if (status === 'unauthenticated') {
                                router.push(`/auth/login?callbackUrl=${router.asPath}`)
                            } else {
                                handleAddToCart()
                            }
                        }}
                    >
                        Add To Cart
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default DetailProductView
