class Vec3
{
    // Constructor
    constructor( x, y, z )
    {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    // Add method
    add( v )
    {
        this.x += v.x;
        this.y += v.y;
        this.z += v.z;
        return this;
    }

    //Sub
    sub( v )
    {
        this.x -= v.x;
        this.y -= v.y;
        this.z -= v.z;
        return this;
    }

    // Sum method
    sum()
    {
        return this.x + this.y + this.z;
    }

    // min method
    min()
    {
        var minimum = this.x;
        if(minimum > this.y)
        {
            minimum = this.y;
        }
        if(minimum > this.z)
        {
            minimum = this.z;
        }
        return minimum;
    }

    // mid method
    mid()
    {
        var middle = this.x
        
        if((this.y > this.x) && (this.y < this.z))
        {
            middle = this.y
        }

        if((this.y < this.x) && (this.y > this.z))
        {
            middle = this.y
        }

        if((this.z > this.x) && (this.z < this.y))
        {
            middle = this.z
        }
        
        if((this.z < this.x) && (this.z > this.y))
        {
            middle = this.z
        }
        
        return middle;
    }

    // max method
    max()
    {
        var maximum = this.x;
        if(maximum < this.y)
        {
            maximum = this.y;
        }
        if(maximum < this.z)
        {
            maximum = this.z;
        }
        return maximum;
    }
}
